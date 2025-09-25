/**
 * Fake Product API - Simulates internal company product database
 */

export interface Product {
  id: string;
  name: string;
  price: string;
  dimensions: string;
  description: string;
  inStock: boolean;
}

// Mock product database
const PRODUCT_DATABASE: Record<string, Product> = {
  'wireless headphones': {
    id: 'P001',
    name: 'Wireless Headphones',
    price: '$89.99',
    dimensions: '7.5 x 6.8 x 1.8 inches',
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.',
    inStock: true
  },
  'bluetooth speaker': {
    id: 'P002',
    name: 'Bluetooth Speaker',
    price: '$49.99',
    dimensions: '3.1 x 3.1 x 3.1 inches',
    description: 'Portable Bluetooth speaker with waterproof design and 12-hour playtime.',
    inStock: true
  },
  'smart watch': {
    id: 'P003',
    name: 'Smart Watch',
    price: '$199.99',
    dimensions: '1.8 x 1.8 x 0.5 inches',
    description: 'Fitness tracking smartwatch with heart rate monitoring and GPS.',
    inStock: true
  },
  'laptop stand': {
    id: 'P004',
    name: 'Laptop Stand',
    price: '$29.99',
    dimensions: '12 x 9 x 4 inches',
    description: 'Adjustable laptop stand for better ergonomics and cooling.',
    inStock: false
  },
  'usb cable': {
    id: 'P005',
    name: 'USB Cable',
    price: '$12.99',
    dimensions: '6 x 0.5 x 0.5 inches',
    description: 'High-speed USB charging cable, 6 feet long.',
    inStock: true
  },
  'phone case': {
    id: 'P006',
    name: 'Phone Case',
    price: '$24.99',
    dimensions: '6 x 3 x 0.5 inches',
    description: 'Protective phone case with screen protector included.',
    inStock: true
  },
  'wireless mouse': {
    id: 'P007',
    name: 'Wireless Mouse',
    price: '$39.99',
    dimensions: '4 x 2.5 x 1.5 inches',
    description: 'Ergonomic wireless mouse with long battery life.',
    inStock: true
  },
  'keyboard': {
    id: 'P008',
    name: 'Keyboard',
    price: '$79.99',
    dimensions: '18 x 6 x 1.5 inches',
    description: 'Mechanical keyboard with RGB lighting.',
    inStock: true
  }
};

/**
 * Find product by name (case insensitive)
 */
export const findProductByName = (productName: string): Product | null => {
  const normalizedName = productName.toLowerCase().trim();
  return PRODUCT_DATABASE[normalizedName] || null;
};

/**
 * Get product price by product name
 */
export const getProductPrice = (productName: string): string => {
  // Simulate API delay
  simulateApiDelay();

  const product = findProductByName(productName);
  if (!product) {
    throw new Error(`Product "${productName}" not found in catalog`);
  }

  return product.price;
};

/**
 * Get product dimensions by product name
 */
export const getProductDimensions = (productName: string): string => {
  // Simulate API delay
  simulateApiDelay();

  const product = findProductByName(productName);
  if (!product) {
    throw new Error(`Product "${productName}" not found in catalog`);
  }

  return product.dimensions;
};

/**
 * Get general product information by product name
 */
export const getProductInfo = (productName: string): string => {
  // Simulate API delay
  simulateApiDelay();

  const product = findProductByName(productName);
  if (!product) {
    throw new Error(`Product "${productName}" not found in catalog`);
  }

  return product.description;
};

/**
 * Check if product is in stock
 */
export const isProductInStock = (productName: string): boolean => {
  // Simulate API delay
  simulateApiDelay();

  const product = findProductByName(productName);
  if (!product) {
    throw new Error(`Product "${productName}" not found in catalog`);
  }

  return product.inStock;
};

/**
 * Get all products (for internal use)
 */
export const getAllProducts = (): Product[] => {
  return Object.values(PRODUCT_DATABASE);
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
