import * as fs from 'fs';
import * as path from 'path';

/**
 * Fake Orders API - Simulates internal company order management system
 */

export interface Customer {
  name: string;
  pin: string;
  orders: Order[];
}

export interface Order {
  date: string;
  orderNumber: string;
  productName: string;
  productQuantity: number;
  status: 'processing' | 'in_transit' | 'delivered';
  estimatedShippingDate: string;
  shippedDate?: string;
}

const CUSTOMERS_FILE = path.join(__dirname, '../../../data/customers.json');
const TODAY = new Date('2025-09-25');

/**
 * Load customers from file
 */
const loadCustomers = (): Customer[] => {
  try {
    const data = fs.readFileSync(CUSTOMERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    throw new Error('Failed to load customer data');
  }
};

/**
 * Authenticate customer by name and PIN
 */
export const authenticateCustomer = (customerName: string, pin: string): Customer | null => {
  // Simulate API delay
  simulateApiDelay();

  const customers = loadCustomers();
  return customers.find(c =>
    c.name.toLowerCase() === customerName.toLowerCase() &&
    c.pin === pin
  ) || null;
};

/**
 * Find order by order number for a specific customer
 */
export const findOrderByNumber = (customerName: string, pin: string, orderNumber: string): Order | null => {
  // Simulate API delay
  simulateApiDelay();

  const customer = authenticateCustomer(customerName, pin);
  if (!customer) {
    throw new Error('Customer authentication failed');
  }

  return customer.orders.find(order => order.orderNumber === orderNumber) || null;
};

/**
 * Get shipment status for an order
 */
export const getOrderShipmentStatus = (customerName: string, pin: string, orderNumber: string): string => {
  // Simulate API delay
  simulateApiDelay();

  const order = findOrderByNumber(customerName, pin, orderNumber);
  if (!order) {
    throw new Error(`Order ${orderNumber} not found for customer ${customerName}`);
  }

  switch (order.status) {
    case 'processing':
      return `Order ${orderNumber} is currently being processed. Estimated shipping date: ${order.estimatedShippingDate}. You will receive a tracking number once the order ships.`;

    case 'in_transit':
      return `Order ${orderNumber} is in transit. It was shipped on ${order.shippedDate}. Estimated delivery: 2-3 business days from ship date. Tracking information has been sent to your email.`;

    case 'delivered':
      return `Order ${orderNumber} was delivered on ${order.shippedDate}. If you haven't received your package, please check with neighbors or your building's front desk.`;

    default:
      return `Order ${orderNumber} status: ${order.status}`;
  }
};

/**
 * Check if order can be cancelled
 */
export const canCancelOrder = (customerName: string, pin: string, orderNumber: string): boolean => {
  // Simulate API delay
  simulateApiDelay();

  const order = findOrderByNumber(customerName, pin, orderNumber);
  if (!order) {
    throw new Error(`Order ${orderNumber} not found for customer ${customerName}`);
  }

  return order.status === 'processing';
};

/**
 * Cancel an order
 */
export const cancelOrder = (customerName: string, pin: string, orderNumber: string): string => {
  // Simulate API delay
  simulateApiDelay(800); // Longer delay to simulate processing

  const order = findOrderByNumber(customerName, pin, orderNumber);
  if (!order) {
    throw new Error(`Order ${orderNumber} not found for customer ${customerName}`);
  }

  if (order.status !== 'processing') {
    throw new Error(`Order ${orderNumber} cannot be cancelled because it is already ${order.status}. Only orders in processing status can be cancelled.`);
  }

  // In a real API, this would update the database
  return `Order ${orderNumber} has been successfully cancelled. You will receive a confirmation email shortly.`;
};

/**
 * Check if order can be returned
 */
export const canReturnOrder = (customerName: string, pin: string, orderNumber: string): boolean => {
  // Simulate API delay
  simulateApiDelay();

  const order = findOrderByNumber(customerName, pin, orderNumber);
  if (!order) {
    throw new Error(`Order ${orderNumber} not found for customer ${customerName}`);
  }

  return order.status === 'delivered';
};

/**
 * Process order return
 */
export const processOrderReturn = (customerName: string, pin: string, orderNumber: string): string => {
  // Simulate API delay
  simulateApiDelay(1000); // Longer delay to simulate processing

  const order = findOrderByNumber(customerName, pin, orderNumber);
  if (!order) {
    throw new Error(`Order ${orderNumber} not found for customer ${customerName}`);
  }

  if (order.status !== 'delivered') {
    throw new Error(`Order ${orderNumber} cannot be returned because it is ${order.status}. Only delivered orders can be returned.`);
  }

  // Generate return label URL
  const customer = authenticateCustomer(customerName, pin);
  if (!customer) {
    throw new Error('Customer authentication failed');
  }

  const returnLabelUrl = `https://returns.example.com/label/${orderNumber}/${customer.name.replace(/\s+/g, '')}`;

  return `Return approved for order ${orderNumber}. Please download your return label here: ${returnLabelUrl}

Instructions:
1. Package the item(s) in original packaging if possible
2. Print and attach the return label
3. Drop off at any authorized shipping location
4. Processing will be completed within 5-7 business days after we receive the item(s)`;
};



/**
 * Simulate API call delay
 */
const simulateApiDelay = (ms: number = 300): void => {
  // In a real implementation, this would be an actual async API call
  const start = Date.now();
  while (Date.now() - start < ms) {
    // Busy wait to simulate network delay
  }
};
