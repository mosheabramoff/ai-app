import fs from 'fs';
import path from 'path';
import { conversationRepository } from '../repositories/conversation.repository';
import template from '../prompts/chatbot.txt';
import { llmClient } from '../llm/client';

const parkInfo = fs.readFileSync(
   path.join(__dirname, '..', 'prompts', 'WonderWorld.md'),
   'utf-8'
);
const instructions = template.replace('{{parkInfo}}', parkInfo);

type chatResponse = {
   id: string;
   message: string;
};

export const chatService = {
   async sendMessage(
      prompt: string,
      conversastionId: string
   ): Promise<chatResponse> {
      const response = await llmClient.generateText({
         model: 'gpt-4o-mini',
         instructions: instructions,
         prompt,
         temperature: 0.2,
         maxTokens: 200,
         previousResponseId:
            conversationRepository.getLastResponseId(conversastionId),
      });

      conversationRepository.setLastResponseId(conversastionId, response.id);
      return {
         id: response.id,
         message: response.text,
      };
   },
};
