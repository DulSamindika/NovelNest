'use server';

/**
 * @fileOverview AI-powered book description generator.
 *
 * - generateBookDescription - A function that generates a book description based on the book's title, author, and genre.
 * - GenerateBookDescriptionInput - The input type for the generateBookDescription function.
 * - GenerateBookDescriptionOutput - The return type for the generateBookDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBookDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  author: z.string().describe('The author of the book.'),
  genre: z.string().describe('The genre of the book.'),
});
export type GenerateBookDescriptionInput = z.infer<typeof GenerateBookDescriptionInputSchema>;

const GenerateBookDescriptionOutputSchema = z.object({
  description: z.string().describe('A captivating description of the book.'),
});
export type GenerateBookDescriptionOutput = z.infer<typeof GenerateBookDescriptionOutputSchema>;

export async function generateBookDescription(
  input: GenerateBookDescriptionInput
): Promise<GenerateBookDescriptionOutput> {
  return generateBookDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBookDescriptionPrompt',
  input: {schema: GenerateBookDescriptionInputSchema},
  output: {schema: GenerateBookDescriptionOutputSchema},
  prompt: `You are a professional book description writer. Please generate an engaging and concise description for the following book:

Title: {{{title}}}
Author: {{{author}}}
Genre: {{{genre}}}

Description:`,
});

const generateBookDescriptionFlow = ai.defineFlow(
  {
    name: 'generateBookDescriptionFlow',
    inputSchema: GenerateBookDescriptionInputSchema,
    outputSchema: GenerateBookDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
