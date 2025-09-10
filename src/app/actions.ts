"use server";

import {
  generateBookDescription,
  type GenerateBookDescriptionInput,
} from '@/ai/flows/generate-book-description';

export async function generateDescriptionAction(
  input: GenerateBookDescriptionInput
) {
  try {
    const result = await generateBookDescription(input);
    return { success: true, description: result.description };
  } catch (error) {
    console.error('Error generating description:', error);
    // In a real app, you might want to log this error to a monitoring service
    return { success: false, error: 'An unexpected error occurred. Please try again.' };
  }
}
