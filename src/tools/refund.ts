import * as fs from 'fs';
import * as path from 'path';
import { Customer } from '../types';

const CUSTOMERS_FILE = path.join(__dirname, '../../data/customers.json');
const TODAY = new Date('2025-09-25');

/**
 * Authenticates a customer using name and PIN only
 */
export async function authenticateCustomer(params: { customerName: string; pin: string }): Promise<string> {
  try {
    // Read customer data
    const customersData = fs.readFileSync(CUSTOMERS_FILE, 'utf-8');
    const customers: Customer[] = JSON.parse(customersData);

    // Find customer
    const customer = customers.find(c =>
      c.name.toLowerCase() === params.customerName.toLowerCase() &&
      c.pin === params.pin
    );

    if (!customer) {
      return "Authentication failed. Please check your name and PIN.";
    }

    return `Authentication successful for ${customer.name}. Please provide your order number.`;

  } catch (error) {
    console.error('Error authenticating customer:', error);
    return "Sorry, there was an error during authentication. Please try again.";
  }
}

/**
 * Handles refund requests with customer authentication and order validation
 */
export async function handleRefundRequest(params: { customerName: string; pin: string; orderNumber: string }): Promise<string> {
  try {
    // Read customer data
    const customersData = fs.readFileSync(CUSTOMERS_FILE, 'utf-8');
    const customers: Customer[] = JSON.parse(customersData);

    // Authenticate customer
    const customer = customers.find(c =>
      c.name.toLowerCase() === params.customerName.toLowerCase() &&
      c.pin === params.pin
    );

    if (!customer) {
      return "Authentication failed. Please check your name and PIN.";
    }

    // Find the order
    const order = customer.orders.find(o => o.orderNumber === params.orderNumber);

    if (!order) {
      return `Order ${params.orderNumber} not found for customer ${customer.name}.`;
    }

    // Check refund eligibility (30 days or less from order date)
    const orderDate = new Date(order.date);
    const daysDiff = Math.floor((TODAY.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff <= 30) {
      return `Refund approved for order ${params.orderNumber}. The refund will be processed within 3-5 business days.`;
    } else {
      return `Refund request denied for order ${params.orderNumber}. Orders must be within 30 days of purchase. This order was placed ${daysDiff} days ago.`;
    }

  } catch (error) {
    console.error('Error processing refund request:', error);
    throw new Error('Failed to process refund request');
  }
}
