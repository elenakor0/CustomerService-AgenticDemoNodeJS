import { GeneralQuestionParams } from '../types';
import { searchKnowledgeBase } from '../APIs/fake-general-api';

/**
 * Handles general questions by calling the fake general API
 */
export const handleGeneralQuestion = async (params: GeneralQuestionParams): Promise<string> => {
  try {
    // Call the fake general API to search the knowledge base
    return searchKnowledgeBase(params.question);

  } catch (error) {
    console.error('Error processing general question:', error);
    throw new Error('Failed to process general question');
  }
}
