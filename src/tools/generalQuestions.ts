import { GeneralQuestionParams } from '../types';

/**
 * Simulates calling a fake API that queries the company RAG store
 */
export async function handleGeneralQuestion(params: GeneralQuestionParams): Promise<string> {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock RAG store responses - in real implementation this would query a vector database
    const knowledgeBase: Record<string, string> = {
      'returns policy': 'Our returns policy allows you to return items within 30 days of purchase for a full refund. Items must be in original condition with all packaging and accessories.',
      'shipping policy': 'We offer free shipping on orders over $50. Standard shipping takes 3-5 business days, and express shipping is available for an additional fee.',
      'warranty': 'All our products come with a 1-year manufacturer warranty. Extended warranty options are available for purchase.',
      'customer support': 'Our customer support team is available Monday through Friday, 9 AM to 6 PM EST. You can reach us at support@example.com or by phone at 1-800-123-4567.',
      'payment methods': 'We accept all major credit cards, PayPal, Apple Pay, and Google Pay. All payments are processed securely.',
      'privacy policy': 'We take your privacy seriously. Your personal information is never sold to third parties and is used only to process your orders and improve our services.',
      'default': 'I apologize, but I couldn\'t find specific information about that topic in our knowledge base. Please contact our customer support team for assistance.'
    };

    // Simple keyword matching - in real implementation this would be semantic search
    const question = params.question.toLowerCase();

    if (question.includes('return') || question.includes('refund')) {
      return knowledgeBase['returns policy'];
    } else if (question.includes('ship') || question.includes('delivery')) {
      return knowledgeBase['shipping policy'];
    } else if (question.includes('warranty') || question.includes('guarantee')) {
      return knowledgeBase['warranty'];
    } else if (question.includes('support') || question.includes('help') || question.includes('contact')) {
      return knowledgeBase['customer support'];
    } else if (question.includes('payment') || question.includes('pay')) {
      return knowledgeBase['payment methods'];
    } else if (question.includes('privacy') || question.includes('data')) {
      return knowledgeBase['privacy policy'];
    } else {
      return knowledgeBase['default'];
    }

  } catch (error) {
    console.error('Error processing general question:', error);
    throw new Error('Failed to process general question');
  }
}
