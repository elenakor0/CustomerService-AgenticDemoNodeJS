import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { OpenAIService } from './services/openaiService';
import { ConsoleInterface } from './utils/consoleInterface';
import { ChatMessage } from './types';

// Load environment variables at the very beginning
dotenv.config();

const SYSTEM_PROMPT = `You are a tool-calling assistant for customer service. You ONLY use tools to process requests.

TOOLS:
- authenticateCustomer(customerName, pin): Verify customer identity FIRST
- handleRefundRequest(customerName, pin, orderNumber): Process refunds AFTER authentication
- handleProductInformation(productName, queryType, question): Get product info
- handleGeneralQuestion(question): Answer questions

REFUND WORKFLOW - CRITICAL:
1. When customer provides name + PIN → call authenticateCustomer tool immediately
2. If authentication fails → stop, don't ask for order number
3. If authentication succeeds → ask for order number
4. When you have order number → call handleRefundRequest tool

EXAMPLES:
User: "refund"
Assistant: "Please provide your full name and 4-digit PIN."

User: "bill 9999" 
Assistant: [calls authenticateCustomer tool → "Authentication failed"]

User: "John Doe 1234"
Assistant: [calls authenticateCustomer tool → "Authentication successful, provide order number"]

NEVER ask for order number until authentication succeeds.`;

async function main() {
  // Clear chat history on startup
  const chatHistoryFile = path.join(__dirname, '../data/chat_history.json');
  try {
    if (fs.existsSync(chatHistoryFile)) {
      fs.unlinkSync(chatHistoryFile);
      console.log('Chat history cleared.');
    }
  } catch (error) {
    console.error('Error clearing chat history:', error);
  }

  console.log('🤖 Customer Service Assistant');
  console.log('===========================');
  console.log('I can help you with:');
  console.log('- Refund requests (requires authentication)');
  console.log('- Product information');
  console.log('- General company questions');
  console.log('');
  console.log('Type "history" to view chat history, "clear" to clear history, or "quit" to exit.');
  console.log('');

  const openaiService = new OpenAIService();
  const consoleInterface = new ConsoleInterface();

  // Initialize with system message
  const systemMessage: ChatMessage = {
    role: 'system',
    content: SYSTEM_PROMPT,
    timestamp: new Date()
  };

  while (true) {
    try {
      const userInput = await consoleInterface.getUserInput('You: ');

      if (userInput.toLowerCase() === 'quit' || userInput.toLowerCase() === 'exit') {
        consoleInterface.displayMessage('Goodbye! 👋');
        break;
      }

      if (userInput.toLowerCase() === 'history') {
        consoleInterface.displayHistory();
        continue;
      }

      if (userInput.toLowerCase() === 'clear') {
        consoleInterface.clearHistory();
        consoleInterface.displayMessage('Chat history cleared.');
        continue;
      }

      // Add user message to history
      const userMessage: ChatMessage = {
        role: 'user',
        content: userInput,
        timestamp: new Date()
      };
      consoleInterface.addToHistory(userMessage);

      // Get recent conversation history for context
      const conversationHistory = [systemMessage, ...consoleInterface.getRecentHistory(10)];

      // Process with OpenAI
      consoleInterface.displayMessage('Assistant: Thinking... 🤔');

      const result = await openaiService.processMessage(conversationHistory);

      let assistantResponse = result.response;

      // Execute tool calls if any
      if (result.toolCalls && result.toolCalls.length > 0) {
        consoleInterface.displayMessage('Assistant: Processing your request... ⚙️');

        const toolResults = await openaiService.executeToolCalls(result.toolCalls);

        // Add tool results to the response
        if (toolResults.length > 0) {
          assistantResponse += '\n\n' + toolResults.join('\n\n');
        }
      }

      // If no tool was called, check if this is a refund request and override with strict response
      if (!result.toolCalls || result.toolCalls.length === 0) {
        const lastUserMessage = conversationHistory[conversationHistory.length - 1];
        if (lastUserMessage && lastUserMessage.role === 'user') {
          const userText = lastUserMessage.content.toLowerCase();
          if (userText.includes('refund') || userText.includes('return')) {
            // For refund requests without complete info, always ask for all details
            if (!assistantResponse || assistantResponse.includes('thank') || assistantResponse.includes('elena') || assistantResponse.includes('please provide your order')) {
              assistantResponse = "Please provide your full name, 4-digit PIN, and order number.";
            }
          } else if (!assistantResponse) {
            assistantResponse = "I'm sorry, I can only help with refund requests, product information, or general company questions. Could you please rephrase your request?";
          }
        }
      }

      // Display and save assistant response
      consoleInterface.displayMessage(`Assistant: ${assistantResponse}`);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };
      consoleInterface.addToHistory(assistantMessage);

    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : 'Unknown error occurred');
      consoleInterface.displayMessage('Sorry, I encountered an error. Please try again.');
    }
  }

  consoleInterface.close();
}

// Check for required environment variables
function checkEnvironmentVariables(): void {
  const requiredVars = ['OPENAI_API_KEY'];
  const missingVars: string[] = [];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  }

  if (missingVars.length > 0) {
    console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
    console.error('Please set these in your .env file');
    process.exit(1);
  }
}

// Start the application
checkEnvironmentVariables();
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
