import { prisma } from '../db';
import type { Review } from '../generated/prisma/client';

export const reviewRepository = {
   async getReviews(productId: number, limit?: number): Promise<Review[]> {
      return await prisma.review.findMany({
         where: { productId: productId },
         orderBy: { createdAt: 'desc' },
         take: limit,
      });
   },
};
