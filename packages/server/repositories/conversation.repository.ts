const conversations = new Map<string, string>();

export const conversationRepository = {
   getLastResponseId(conversastionId: string) {
      return conversations.get(conversastionId);
   },
   setLastResponseId(conversastionId: string, responseId: string) {
      conversations.set(conversastionId, responseId);
   },
};
