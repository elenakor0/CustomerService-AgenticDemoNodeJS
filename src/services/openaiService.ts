import OpenAI from 'openai';
import { ChatMessage, ToolCall } from '../types';
import { availableTools, toolFunctions } from '../tools';

type OpenAIService = {
  processMessage: (messages: ChatMessage[]) => Promise<{ response: string; toolCalls?: ToolCall[] }>;
  executeToolCalls: (toolCalls: ToolCall[]) => Promise<string[]>;
  client: OpenAI;
};


export function createOpenAIService(opts?: { apiKey?: string; model?: string }): OpenAIService {
  const apiKey = opts?.apiKey ?? process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }

  const model = opts?.model ?? process.env.MODEL ?? 'gpt-4o-mini';
  const client = new OpenAI({ apiKey });

  /**
   * Process a user message and return the assistant's response
   */
  const processMessage = async (
    messages: ChatMessage[]
  ): Promise<{ response: string; toolCalls?: ToolCall[] }> => {
    try {
      const openaiMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await client.chat.completions.create({
        model,
        messages: openaiMessages,
        tools: availableTools,
        tool_choice: 'auto',
        temperature: 0,
        max_tokens: 1000,
      });

      const choice = response.choices[0];
      if (!choice) {
        throw new Error('No response from OpenAI');
      }

      let responseText = choice.message.content || '';
      let toolCalls: ToolCall[] | undefined;

      // Check if there are tool calls
      if (choice.message.tool_calls) {
        toolCalls = choice.message.tool_calls.map(tc => ({
          id: tc.id,
          type: tc.type,
          function: {
            name: tc.function.name,
            arguments: tc.function.arguments,
          },
        }));

        if (responseText) responseText += '\n\n';
      }

      return { response: responseText, toolCalls };
    } catch (error) {
      console.error('Error processing message with OpenAI:', error);
      throw error;
    }
  };

  /**
   * Execute tool calls and return results
   */
  const executeToolCalls = async (toolCalls: ToolCall[]): Promise<string[]> => {
    const results: string[] = [];

    for (const toolCall of toolCalls) {
      try {
        const functionName = toolCall.function.name as keyof typeof toolFunctions;
        const functionArgs = JSON.parse(toolCall.function.arguments);

        const toolFunction = toolFunctions[functionName];
        if (!toolFunction) {
          results.push(`Error: Tool function '${functionName}' not found`);
          continue;
        }

        const result = await toolFunction(functionArgs);
        results.push(result);
      } catch (error) {
        console.error(`Error executing tool ${toolCall.function.name}:`, error);
        results.push(
          `Error executing ${toolCall.function.name}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      }
    }

    return results;
  };

  return { processMessage, executeToolCalls, client };
}
