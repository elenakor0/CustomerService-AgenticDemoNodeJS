import { ProductInfoParams } from '../types';

/**
 * Simulates calling a fake internal company API to get product information
 */
export async function handleProductInformation(params: ProductInfoParams): Promise<string> {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock product database - in real implementation this would be an API call
    const productData: Record<string, any> = {
      'wireless headphones': {
        price: '$89.99',
        dimensions: '7.5 x 6.8 x 1.8 inches',
        description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life.'
      },
      'bluetooth speaker': {
        price: '$49.99',
        dimensions: '3.1 x 3.1 x 3.1 inches',
        description: 'Portable Bluetooth speaker with waterproof design and 12-hour playtime.'
      },
      'smart watch': {
        price: '$199.99',
        dimensions: '1.8 x 1.8 x 0.5 inches',
        description: 'Fitness tracking smartwatch with heart rate monitoring and GPS.'
      },
      'laptop stand': {
        price: '$29.99',
        dimensions: '12 x 9 x 4 inches',
        description: 'Adjustable laptop stand for better ergonomics and cooling.'
      }
    };

    const product = productData[params.productName.toLowerCase()];

    if (!product) {
      return `Product "${params.productName}" not found in our catalog.`;
    }

    switch (params.queryType) {
      case 'price':
        return `The ${params.productName} costs ${product.price}.`;

      case 'dimensions':
        return `The ${params.productName} dimensions are ${product.dimensions}.`;

      case 'general':
        return product.description;

      default:
        return `Product information for ${params.productName}: ${product.description} Price: ${product.price}, Dimensions: ${product.dimensions}.`;
    }

  } catch (error) {
    console.error('Error fetching product information:', error);
    throw new Error('Failed to fetch product information');
  }
}
