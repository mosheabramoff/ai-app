import React, { useState } from 'react';
import axios from 'axios';
import StarRating from './StarRating';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { HiSparkles } from 'react-icons/hi2';
import ReviewSkeleton from './ReviewSkeleton';

type Props = {
   productId: number;
};

type Review = {
   id: number;
   author: string;
   content: string;
   rating: number;
   createdAt: string;
};

type GetReviewsResponse = {
   summary: string | null;
   reviews: Review[];
};

type SummarizeResponse = {
   summary: string;
};

const ReviewList = ({ productId }: Props) => {
   const {
      data: reviewData,
      isLoading,
      error,
   } = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: () => fetchReviews(),
   });

   const {
      mutate: handleSummarize,
      isPending: isSummarizing,
      isError: isSummarizeError,
      data: summarizeResponse,
   } = useMutation<SummarizeResponse>({
      mutationFn: () => summarizeReviews(),
   });

   const fetchReviews = async () => {
      const { data } = await axios.get<GetReviewsResponse>(
         `/api/products/${productId}/reviews`
      );
      return data;
   };

   const summarizeReviews = async () => {
      const { data } = await axios.post<SummarizeResponse>(
         `/api/products/${productId}/reviews/summarize`
      );
      return data;
   };

   if (isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <ReviewSkeleton key={i} />
            ))}
         </div>
      );
   }

   if (error) {
      return <div className="text-red-500">{error.message}</div>;
   }

   if (!reviewData || reviewData.reviews.length === 0) {
      return <div>No reviews available.</div>;
   }

   const currentSummary = summarizeResponse?.summary || reviewData.summary;

   return (
      <div>
         <div className="mb-5">
            <h2 className="text-2xl font-bold mb-2">Reviews</h2>
            {currentSummary ? (
               <div className="italic text-gray-600">{currentSummary}</div>
            ) : (
               <div>
                  <Button
                     onClick={() => handleSummarize()}
                     className="cursor-pointer"
                     disabled={isSummarizing}
                  >
                     <HiSparkles />
                     Summarize
                  </Button>
                  {isSummarizing && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}
                  {isSummarizeError && (
                     <div className="text-red-500 mt-2">
                        Failed to summarize reviews. Please try again.
                     </div>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewData?.reviews.map((review) => (
               <div key={review.id}>
                  <div className="font-semibold">{review.author}</div>
                  <div>
                     <StarRating value={review.rating} />
                  </div>
                  <p className="py-2">{review.content}</p>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ReviewList;
