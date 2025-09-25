import { authenticateCustomer, handleRefundRequest } from './refund';
import { handleProductInformation } from './productInfo';
import { handleGeneralQuestion } from './generalQuestions';

export const availableTools = [
  {
    type: "function" as const,
    function: {
      name: "authenticateCustomer",
      description: "Authenticate a customer using their name and PIN. Call this FIRST when customer provides name and PIN, before asking for order number.",
      parameters: {
        type: "object",
        properties: {
          customerName: {
            type: "string",
            description: "The customer's full name"
          },
          pin: {
            type: "string",
            description: "The customer's 4-digit PIN"
          }
        },
        required: ["customerName", "pin"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "handleRefundRequest",
      description: "Process a refund request for an authenticated customer. Only call this after successful authentication.",
      parameters: {
        type: "object",
        properties: {
          customerName: {
            type: "string",
            description: "The customer's full name"
          },
          pin: {
            type: "string",
            description: "The customer's 4-digit PIN"
          },
          orderNumber: {
            type: "string",
            description: "The order number for the refund request"
          }
        },
        required: ["customerName", "pin", "orderNumber"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "handleProductInformation",
      description: "Get information about a specific product including price, dimensions, or general description. Use this when users ask about product details.",
      parameters: {
        type: "object",
        properties: {
          productName: {
            type: "string",
            description: "The name of the product to get information about"
          },
          queryType: {
            type: "string",
            enum: ["price", "dimensions", "general"],
            description: "The type of information requested about the product"
          },
          question: {
            type: "string",
            description: "The original question for context when queryType is general"
          }
        },
        required: ["productName", "queryType"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "handleGeneralQuestion",
      description: "Answer general questions about company policies, procedures, or information not related to specific products or refunds.",
      parameters: {
        type: "object",
        properties: {
          question: {
            type: "string",
            description: "The general question to answer"
          }
        },
        required: ["question"]
      }
    }
  }
];

export const toolFunctions = {
  authenticateCustomer,
  handleRefundRequest,
  handleProductInformation,
  handleGeneralQuestion
};
