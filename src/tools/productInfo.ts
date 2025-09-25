import { ProductInfoParams } from '../types';
import {
  getProductPrice,
  getProductDimensions,
  getProductInfo,
  isProductInStock
} from '../APIs/fake-product-api';

/**
 * Handles product information requests by calling the fake product API
 */
export const handleProductInformation = async (params: ProductInfoParams): Promise<string> => {
  try {
    switch (params.queryType) {
      case 'price':
        const price = getProductPrice(params.productName);
        return `The ${params.productName} costs ${price}.`;

      case 'dimensions':
        const dimensions = getProductDimensions(params.productName);
        return `The ${params.productName} dimensions are ${dimensions}.`;

      case 'general':
        const description = getProductInfo(params.productName);
        return description;

      default:
        // Provide comprehensive product information
        const fullPrice = getProductPrice(params.productName);
        const fullDimensions = getProductDimensions(params.productName);
        const fullDescription = getProductInfo(params.productName);
        const inStock = isProductInStock(params.productName);

        return `Product information for ${params.productName}:
• Description: ${fullDescription}
• Price: ${fullPrice}
• Dimensions: ${fullDimensions}
• Availability: ${inStock ? 'In stock' : 'Out of stock'}`;
    }

  } catch (error) {
    console.error('Error fetching product information:', error);
    if (error instanceof Error) {
      return error.message;
    }
    throw new Error('Failed to fetch product information');
  }
}
