// 'use server';

/**
 * @fileOverview AI-powered search for print locations using natural language.
 *
 * - printLocationSearch - A function that allows users to search for print locations using natural language.
 * - PrintLocationSearchInput - The input type for the printLocationSearch function.
 * - PrintLocationSearchOutput - The return type for the printLocationSearch function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrintLocationSearchInputSchema = z.object({
  query: z.string().describe('The search query in natural language.'),
});

export type PrintLocationSearchInput = z.infer<
  typeof PrintLocationSearchInputSchema
>;

const PrintLocationSearchOutputSchema = z.object({
  results: z
    .array(z.string())
    .describe('A list of print location names that match the query.'),
});

export type PrintLocationSearchOutput = z.infer<
  typeof PrintLocationSearchOutputSchema
>;

export async function printLocationSearch(
  input: PrintLocationSearchInput
): Promise<PrintLocationSearchOutput> {
  return printLocationSearchFlow(input);
}

const printLocationSearchPrompt = ai.definePrompt({
  name: 'printLocationSearchPrompt',
  input: {schema: PrintLocationSearchInputSchema},
  output: {schema: PrintLocationSearchOutputSchema},
  prompt: `You are an expert at finding relevant print locations based on user queries.

  Based on the following query, identify relevant print locations.

  Query: {{{query}}}

  Return a list of print location names that match the query.
  `,
});

const printLocationSearchFlow = ai.defineFlow(
  {
    name: 'printLocationSearchFlow',
    inputSchema: PrintLocationSearchInputSchema,
    outputSchema: PrintLocationSearchOutputSchema,
  },
  async input => {
    const {output} = await printLocationSearchPrompt(input);
    return output!;
  }
);
