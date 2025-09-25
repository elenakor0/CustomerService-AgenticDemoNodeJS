/**
 * Fake General API - Simulates internal company knowledge base and policies
 */

// Mock knowledge base
const KNOWLEDGE_BASE: Record<string, string> = {
  'returns policy': 'Our returns policy allows you to return items within 30 days of purchase. Items must be in original condition with all packaging and accessories.',
  'shipping policy': 'We offer free shipping on orders over $50. Standard shipping takes 3-5 business days, and express shipping is available for an additional fee.',
  'warranty': 'All our products come with a 1-year manufacturer warranty. Extended warranty options are available for purchase.',
  'customer support': 'Our customer support team is available Monday through Friday, 9 AM to 6 PM EST. You can reach us at support@example.com or by phone at 1-800-123-4567.',
  'payment methods': 'We accept all major credit cards, PayPal, Apple Pay, and Google Pay. All payments are processed securely.',
  'privacy policy': 'We take your privacy seriously. Your personal information is never sold to third parties and is used only to process your orders and improve our services.',
  'cancellation policy': 'Orders can be cancelled if they are still in processing status. Processing typically takes 24-48 hours from placement.',
  'default': 'I apologize, but I couldn\'t find specific information about that topic in our knowledge base. Please contact our customer support team for assistance.'
};

/**
 * Search knowledge base for relevant information
 */
export const searchKnowledgeBase = (query: string): string => {
  // Simulate API delay
  simulateApiDelay();

  const normalizedQuery = query.toLowerCase().trim();

  // Simple keyword matching - in real implementation this would be semantic search
  if (normalizedQuery.includes('return')) {
    return KNOWLEDGE_BASE['returns policy'];
  } else if (normalizedQuery.includes('ship') || normalizedQuery.includes('delivery')) {
    return KNOWLEDGE_BASE['shipping policy'];
  } else if (normalizedQuery.includes('warranty') || normalizedQuery.includes('guarantee')) {
    return KNOWLEDGE_BASE['warranty'];
  } else if (normalizedQuery.includes('support') || normalizedQuery.includes('help') || normalizedQuery.includes('contact')) {
    return KNOWLEDGE_BASE['customer support'];
  } else if (normalizedQuery.includes('payment') || normalizedQuery.includes('pay')) {
    return KNOWLEDGE_BASE['payment methods'];
  } else if (normalizedQuery.includes('privacy') || normalizedQuery.includes('data')) {
    return KNOWLEDGE_BASE['privacy policy'];
  } else if (normalizedQuery.includes('cancel')) {
    return KNOWLEDGE_BASE['cancellation policy'];
  } else if (normalizedQuery.includes('refund')) {
    return 'For refund-related inquiries, please contact our customer support team directly.'
  } else {
    return KNOWLEDGE_BASE['default'];
  }
};



/**
 * Simulate API call delay
 */
const simulateApiDelay = (ms: number = 400): void => {
  // In a real implementation, this would be an actual async API call
  const start = Date.now();
  while (Date.now() - start < ms) {
    // Busy wait to simulate network delay
  }
};
