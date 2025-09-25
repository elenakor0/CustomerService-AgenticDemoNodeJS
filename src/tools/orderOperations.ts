import { saveCustomerSession, getCurrentSession } from '../utils/sessionManager';
import {
  authenticateCustomer as apiAuthenticate,
  findOrderByNumber,
  canCancelOrder,
  cancelOrder,
  canReturnOrder,
  processOrderReturn,
  getOrderShipmentStatus
} from '../APIs/fake-orders-api';

/**
 * Authenticates a customer and finds their order using the fake orders API
 */
const authenticateAndFindOrder = (customerName?: string, pin?: string, orderNumber?: string): { customer: any; order: any } | { error: string } | { needsAuth: string } => {
  try {
    // Check if we have a current session
    const session = getCurrentSession();

    // Use session credentials if available, otherwise use provided credentials
    const authName = customerName || session?.customerName;
    const authPin = pin || session?.pin;

    if (!authName || !authPin) {
      return { needsAuth: "Please provide your full name and 4-digit PIN." };
    }

    if (!orderNumber) {
      return { needsAuth: "Please provide your order number." };
    }

    // Try to find the order using the API
    try {
      const order = findOrderByNumber(authName, authPin, orderNumber);

      // Save session if new credentials were provided
      if (customerName && pin) {
        saveCustomerSession(authName, pin);
      }

      return { customer: { name: authName }, order };
    } catch (apiError) {
      return { error: apiError instanceof Error ? apiError.message : 'Order not found' };
    }

  } catch (error) {
    console.error('Error in authenticateAndFindOrder:', error);
    return { error: 'An error occurred while processing your request.' };
  }
}

/**
 * Cancel an order if it's in processing status
 */
export const handleOrderCancellation = async (params: { customerName?: string; pin?: string; orderNumber: string; confirmation?: boolean }): Promise<string> => {
  try {
    // Get session or provided credentials
    const session = getCurrentSession();
    const customerName = params.customerName || session?.customerName;
    const pin = params.pin || session?.pin;

    if (!customerName || !pin) {
      return "Please provide your full name and 4-digit PIN.";
    }

    // Save session if new credentials were provided (before trying to access order)
    if (params.customerName && params.pin) {
      // First verify credentials are valid by trying to authenticate
      try {
        const customer = apiAuthenticate(customerName, pin);
        if (customer) {
          saveCustomerSession(params.customerName, params.pin);
        } else {
          return "Authentication failed. Please check your name and PIN.";
        }
      } catch (error) {
        return "Authentication failed. Please check your name and PIN.";
      }
    }

    // Check if order can be cancelled using the API
    let canCancel: boolean;
    try {
      canCancel = canCancelOrder(customerName, pin, params.orderNumber);
    } catch (error) {
      return `Order ${params.orderNumber} not found. Please check the order number and make sure it belongs to your account.`;
    }

    if (!canCancel) {
      // If can't cancel, get the order to see its status
      try {
        const order = findOrderByNumber(customerName, pin, params.orderNumber);
        return `Order ${params.orderNumber} cannot be cancelled because it is already ${order?.status || 'unknown'}. Only orders in processing status can be cancelled.`;
      } catch {
        return `Order ${params.orderNumber} not found. Please check the order number and make sure it belongs to your account.`;
      }
    }

    // Check if confirmation is needed
    if (!params.confirmation) {
      // Get order details for confirmation message
      try {
        const order = findOrderByNumber(customerName, pin, params.orderNumber);
        return `Just confirming that we need to cancel order ${params.orderNumber} (${order?.productName || 'Unknown Product'}). Please respond with yes/no.`;
      } catch {
        return `Just confirming that we need to cancel order ${params.orderNumber}. Please respond with yes/no.`;
      }
    }

    // Process the cancellation using the API
    let result: string;
    try {
      result = cancelOrder(customerName, pin, params.orderNumber);
    } catch (error) {
      return `Sorry, there was an error cancelling your order. Please try again.`;
    }

    return result;

  } catch (error) {
    console.error('Error cancelling order:', error);
    if (error instanceof Error) {
      return error.message;
    }
    return 'Sorry, there was an error cancelling your order. Please try again.';
  }
}

/**
 * Process order return for delivered orders
 */
export const handleOrderReturn = async (params: { customerName?: string; pin?: string; orderNumber: string; confirmation?: boolean }): Promise<string> => {
  try {
    // Get session or provided credentials
    const session = getCurrentSession();
    const customerName = params.customerName || session?.customerName;
    const pin = params.pin || session?.pin;

    if (!customerName || !pin) {
      return "Please provide your full name and 4-digit PIN.";
    }

    // Save session if new credentials were provided (before trying to access order)
    if (params.customerName && params.pin) {
      // First verify credentials are valid by trying to authenticate
      try {
        const customer = apiAuthenticate(customerName, pin);
        if (customer) {
          saveCustomerSession(params.customerName, params.pin);
        } else {
          return "Authentication failed. Please check your name and PIN.";
        }
      } catch (error) {
        return "Authentication failed. Please check your name and PIN.";
      }
    }

    // Check if order can be returned using the API
    let canReturn: boolean;
    try {
      canReturn = canReturnOrder(customerName, pin, params.orderNumber);
    } catch (error) {
      return `Order ${params.orderNumber} not found. Please check the order number and make sure it belongs to your account.`;
    }

    if (!canReturn) {
      // If can't return, get the order to see its status
      try {
        const order = findOrderByNumber(customerName, pin, params.orderNumber);
        return `Order ${params.orderNumber} cannot be returned because it is ${order?.status || 'unknown'}. Only delivered orders can be returned.`;
      } catch {
        return `Order ${params.orderNumber} not found. Please check the order number and make sure it belongs to your account.`;
      }
    }

    // Check if confirmation is needed
    if (!params.confirmation) {
      // Get order details for confirmation message
      try {
        const order = findOrderByNumber(customerName, pin, params.orderNumber);
        return `Just confirming that we need to process a return for order ${params.orderNumber} (${order?.productName || 'Unknown Product'}). Please respond with yes/no.`;
      } catch {
        return `Just confirming that we need to process a return for order ${params.orderNumber}. Please respond with yes/no.`;
      }
    }

    // Process the return using the API
    let result: string;
    try {
      result = processOrderReturn(customerName, pin, params.orderNumber);
    } catch (error) {
      return `Sorry, there was an error processing your return. Please try again.`;
    }

    return result;

  } catch (error) {
    console.error('Error processing return:', error);
    if (error instanceof Error) {
      return error.message;
    }
    return 'Sorry, there was an error processing your return. Please try again.';
  }
}

/**
 * Check shipment status of an order
 */
export const handleShipmentStatus = async (params: { customerName?: string; pin?: string; orderNumber: string }): Promise<string> => {
  try {
    // Get session or provided credentials
    const session = getCurrentSession();
    const customerName = params.customerName || session?.customerName;
    const pin = params.pin || session?.pin;

    if (!customerName || !pin) {
      return "Please provide your full name and 4-digit PIN.";
    }

    // Save session if new credentials were provided (before trying to access order)
    if (params.customerName && params.pin) {
      // First verify credentials are valid by trying to authenticate
      try {
        const customer = apiAuthenticate(customerName, pin);
        if (customer) {
          saveCustomerSession(params.customerName, params.pin);
        } else {
          return "Authentication failed. Please check your name and PIN.";
        }
      } catch (error) {
        return "Authentication failed. Please check your name and PIN.";
      }
    }

    // Get shipment status using the API
    let result: string;
    try {
      result = getOrderShipmentStatus(customerName, pin, params.orderNumber);
    } catch (error) {
      return `Order ${params.orderNumber} not found. Please check the order number and make sure it belongs to your account.`;
    }

    return result;

  } catch (error) {
    console.error('Error checking shipment status:', error);
    if (error instanceof Error) {
      return error.message;
    }
    return 'Sorry, there was an error checking your shipment status. Please try again.';
  }
}
