import { handleOrderCancellation, handleOrderReturn, handleShipmentStatus } from './orderOperations';
import { handleProductInformation } from './productInfo';
import { handleGeneralQuestion } from './generalQuestions';

export const availableTools = [
  {
    type: "function" as const,
    function: {
      name: "handleOrderCancellation",
      description: "Cancel an order if it's in processing status. Uses session authentication if customer is already authenticated.",
      parameters: {
        type: "object",
        properties: {
          customerName: {
            type: "string",
            description: "The customer's full name (optional if already authenticated in session)"
          },
          pin: {
            type: "string",
            description: "The customer's 4-digit PIN (optional if already authenticated in session)"
          },
          orderNumber: {
            type: "string",
            description: "The order number to cancel"
          },
          confirmation: {
            type: "boolean",
            description: "Set to true to confirm the cancellation, false or omit to ask for confirmation"
          }
        },
        required: ["orderNumber"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "handleOrderReturn",
      description: "Process a return for a delivered order. Uses session authentication if customer is already authenticated.",
      parameters: {
        type: "object",
        properties: {
          customerName: {
            type: "string",
            description: "The customer's full name (optional if already authenticated in session)"
          },
          pin: {
            type: "string",
            description: "The customer's 4-digit PIN (optional if already authenticated in session)"
          },
          orderNumber: {
            type: "string",
            description: "The order number to return"
          },
          confirmation: {
            type: "boolean",
            description: "Set to true to confirm the return, false or omit to ask for confirmation"
          }
        },
        required: ["orderNumber"]
      }
    }
  },
  {
    type: "function" as const,
    function: {
      name: "handleShipmentStatus",
      description: "Check the shipment status of an order. Uses session authentication if customer is already authenticated.",
      parameters: {
        type: "object",
        properties: {
          customerName: {
            type: "string",
            description: "The customer's full name (optional if already authenticated in session)"
          },
          pin: {
            type: "string",
            description: "The customer's 4-digit PIN (optional if already authenticated in session)"
          },
          orderNumber: {
            type: "string",
            description: "The order number to check status for"
          }
        },
        required: ["orderNumber"]
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
      description: "Answer general questions about company policies, procedures, or general information.",
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
  handleOrderCancellation,
  handleOrderReturn,
  handleShipmentStatus,
  handleProductInformation,
  handleGeneralQuestion
};
