'use server';

/**
 * @fileOverview AI-powered general internet search flow.
 *
 * - internetSearch - A function that allows users to search the internet for information using natural language.
 * - InternetSearchInput - The input type for the internetSearch function.
 * - InternetSearchOutput - The return type for the internetSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InternetSearchInputSchema = z.object({
  query: z.string().describe('The search query from the user, using keywords or natural language.'),
});
export type InternetSearchInput = z.infer<typeof InternetSearchInputSchema>;

const InternetSearchOutputSchema = z.object({
  answer: z.string().describe('A comprehensive answer or summary of information found on the internet related to the user query.'),
});
export type InternetSearchOutput = z.infer<typeof InternetSearchOutputSchema>;

export async function internetSearch(input: InternetSearchInput): Promise<InternetSearchOutput> {
  return internetSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'internetSearchPrompt',
  input: {schema: InternetSearchInputSchema},
  output: {schema: InternetSearchOutputSchema},
  prompt: `You are an AI assistant acting as a general internet search engine. Your goal is to understand the user's query, search the internet for relevant information, and provide a comprehensive answer or summary. Focus on providing factual and helpful information. If the query appears to be educational in nature, prioritize information from reliable educational sources if possible.

Query: {{{query}}}

Provide a detailed and informative answer based on your search.
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
