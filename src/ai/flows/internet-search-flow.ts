
'use server';

/**
 * @fileOverview AI-powered general internet search and conversational assistant flow.
 *
 * - internetSearch - A function that allows users to interact with an AI assistant for information.
 * - InternetSearchInput - The input type for the internetSearch function.
 * - InternetSearchOutput - The return type for the internetSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InternetSearchInputSchema = z.object({
  query: z.string().describe('The user query or message to the AI assistant.'),
});
export type InternetSearchInput = z.infer<typeof InternetSearchInputSchema>;

const InternetSearchOutputSchema = z.object({
  answer: z.string().describe('A comprehensive and conversational answer from the AI assistant related to the user query.'),
});
export type InternetSearchOutput = z.infer<typeof InternetSearchOutputSchema>;

export async function internetSearch(input: InternetSearchInput): Promise<InternetSearchOutput> {
  return internetSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'internetSearchPrompt',
  input: {schema: InternetSearchInputSchema},
  output: {schema: InternetSearchOutputSchema},
  prompt: `You are a helpful AI assistant. The user says: {{{query}}}. Respond to the user concisely and informatively. If the query seems to be a general knowledge question or request for explanation, provide a comprehensive answer. If it is a casual statement, respond in a friendly conversational manner.
`,
});

const internetSearchFlow = ai.defineFlow(
  {
    name: 'internetSearchFlow',
    inputSchema: InternetSearchInputSchema,
    outputSchema: InternetSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
