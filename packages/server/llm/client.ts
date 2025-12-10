import OpenAI from 'openai';
import { InferenceClient } from '@huggingface/inference';
import summarizePrompt from '../llm/prompts/summarize-reviews.txt';

const inferenceClient = new InferenceClient(process.env.HF_TOKEN);

const openAIClient = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

type GenerateTextOptions = {
   prompt: string;
   model?: string;
   temperature?: number;
   maxTokens?: number;
   instructions?: string;
   previousResponseId?: string;
};

type LLMResponse = {
   id: string;
   text: string;
};

export const llmClient = {
   async generateText({
      model = 'gpt-4.1',
      prompt,
      temperature = 0.2,
      maxTokens = 500,
      instructions,
      previousResponseId,
   }: GenerateTextOptions): Promise<LLMResponse> {
      const response = await openAIClient.responses.create({
         model,
         input: prompt,
         temperature,
         max_output_tokens: maxTokens,
         instructions,
         previous_response_id: previousResponseId,
      });

      return {
         id: response.id,
         text: response.output_text,
      };
   },
   async summarizeReviews(reviews: string): Promise<string> {
      const chatCompletion = await inferenceClient.chatCompletion({
         model: 'meta-llama/Llama-3.1-8B-Instruct:novita',
         messages: [
            {
               role: 'system',
               content: summarizePrompt,
            },
            {
               role: 'user',
               content: reviews,
            },
         ],
      });
      return chatCompletion?.choices[0]?.message.content || '';
   },
};
