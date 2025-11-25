import OpenAI from 'openai'
import { conversationRepository } from '../repositories/conversation.repository'

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
})

type chatResponse = {
   id: string
   message: string
}

export const chatService = {
   async sendMessage(
      prompt: string,
      conversastionId: string
   ): Promise<chatResponse> {
      const response = await client.responses.create({
         model: 'gpt-4o-mini',
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 100,
         previous_response_id:
            conversationRepository.getLastResponseId(conversastionId),
      })

      conversationRepository.setLastResponseId(conversastionId, response.id)
      return {
         id: response.id,
         message: response.output_text,
      }
   },
}
