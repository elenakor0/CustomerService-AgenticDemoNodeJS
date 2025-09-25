import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { OpenAIService } from './services/openaiService';
import { ConsoleInterface } from './utils/consoleInterface';
import { clearSession } from './utils/sessionManager';
import { ChatMessage } from './types';

// Load environment variables at the very beginning
dotenv.config();

const SYSTEM_PROMPT = `You are a tool-calling assistant for customer service. You ONLY use tools to process requests.

AVAILABLE TOOLS:
- handleOrderCancellation(orderNumber, customerName?, pin?, confirmation?): Cancel orders
- handleOrderReturn(orderNumber, customerName?, pin?, confirmation?): Process returns  
- handleShipmentStatus(orderNumber, customerName?, pin?): Check order status
- handleProductInformation(productName, queryType, question): Get product info
- handleGeneralQuestion(question): Answer general questions

CRITICAL WORKFLOW:
1. For order operations (cancel, return, status), ALWAYS try calling the tool with just the orderNumber first
2. The tool will automatically use session credentials if customer is authenticated
3. If tool asks for authentication, then ask customer for credentials
4. Extract order numbers from user messages - if they say "cancel order ORD005", use "ORD005"
5. CONFIRMATION HANDLING: If tool asks "Please respond with yes/no" and user says "yes", call the SAME tool again with confirmation=true

EXAMPLES:
User: "cancel order ORD005"
Assistant: [calls handleOrderCancellation(orderNumber="ORD005")]

User: "return ORD002"
Assistant: [calls handleOrderReturn(orderNumber="ORD002")] → "Just confirming..."

User: "yes"
Assistant: [calls handleOrderReturn(orderNumber="ORD002", confirmation=true)]`;

const main = async (): Promise<void> => {
  // Clear chat history and customer session on startup
  const chatHistoryFile = path.join(__dirname, '../data/chat_history.json');
  try {
    if (fs.existsSync(chatHistoryFile)) {
      fs.unlinkSync(chatHistoryFile);
      console.log('Chat history cleared.');
    }
    clearSession();
    console.log('Customer session cleared.');
  } catch (error) {
    console.error('Error clearing files:', error);
  }

  console.log('🤖 Customer Service Assistant');
  console.log('===========================');
  console.log('I can help you with:');
  console.log('- Order cancellations (processing orders only)');
  console.log('- Order returns (delivered orders only)');
  console.log('- Shipment status inquiries');
  console.log('- Product information');
  console.log('- General company questions');
  console.log('');
  console.log('Type "quit" to exit.');
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

      // If no tool was called, check for specific scenarios
      if (!result.toolCalls || result.toolCalls.length === 0) {
        const lastUserMessage = conversationHistory[conversationHistory.length - 1];
        if (lastUserMessage && lastUserMessage.role === 'user') {
          const userText = lastUserMessage.content.toLowerCase().trim();
          
          // Check if user is responding to a confirmation request
          if ((userText === 'yes' || userText === 'y') && conversationHistory.length >= 2) {
            const previousAssistantMessage = conversationHistory[conversationHistory.length - 2];
            if (previousAssistantMessage && previousAssistantMessage.content.includes('Please respond with yes/no')) {
              assistantResponse = "I understand you want to confirm. Let me process that for you.";
            }
           } 
           //else if (userText.includes('return')) {
        //     // For return requests without complete info, always ask for order number
        //     if (!assistantResponse || assistantResponse.includes('thank') || assistantResponse.includes('elena') || assistantResponse.includes('please provide your order')) {
        //       assistantResponse = "Please provide your order number.";
        //     }
        //   } 
            else if (!assistantResponse) {
            assistantResponse = "I'm sorry, I can only help with order cancellations, returns, shipment status, product information, or general company questions. Could you please rephrase your request?";
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
const checkEnvironmentVariables = (): void => {
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
