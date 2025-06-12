'use server';

/**
 * @fileOverview AI-powered task search flow.
 *
 * - taskSearch - A function that allows users to search for tasks using keywords and natural language.
 * - TaskSearchInput - The input type for the taskSearch function.
 * - TaskSearchOutput - The return type for the taskSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TaskSearchInputSchema = z.object({
  query: z.string().describe('The search query from the user, using keywords or natural language.'),
});
export type TaskSearchInput = z.infer<typeof TaskSearchInputSchema>;

const TaskSearchOutputSchema = z.object({
  results: z
    .array(z.string())
    .describe('A list of relevant tasks that match the search query.'),
});
export type TaskSearchOutput = z.infer<typeof TaskSearchOutputSchema>;

export async function taskSearch(input: TaskSearchInput): Promise<TaskSearchOutput> {
  return taskSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'taskSearchPrompt',
  input: {schema: TaskSearchInputSchema},
  output: {schema: TaskSearchOutputSchema},
  prompt: `You are an AI search assistant specialized in finding educational tasks for students. Your goal is to understand student queries and return a list of relevant task IDs that strictly pertain to educational assignments, research, or learning activities.

Query: {{{query}}}

Focus exclusively on educational content. Results should be a JSON array of strings representing task IDs.`,
});

const taskSearchFlow = ai.defineFlow(
  {
    name: 'taskSearchFlow',
    inputSchema: TaskSearchInputSchema,
    outputSchema: TaskSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
