import React, { useState } from 'react';
import StarRating from './StarRating';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { HiSparkles } from 'react-icons/hi2';
import ReviewSkeleton from './ReviewSkeleton';
import {
   reviewApi,
   type GetReviewsResponse,
   type SummarizeResponse,
} from './ReviewApi';

type Props = {
   productId: number;
};

const ReviewList = ({ productId }: Props) => {
   const reviewsQuery = useQuery<GetReviewsResponse>({
      queryKey: ['reviews', productId],
      queryFn: () => reviewApi.fetchReviews(productId),
   });

   const summaryMutation = useMutation<SummarizeResponse>({
      mutationFn: () => reviewApi.summarizeReviews(productId),
   });

   if (reviewsQuery.isLoading) {
      return (
         <div className="flex flex-col gap-5">
            {[1, 2, 3].map((i) => (
               <ReviewSkeleton key={i} />
            ))}
         </div>
      );
   }

   if (reviewsQuery.isError) {
      return <div className="text-red-500">{reviewsQuery.error.message}</div>;
   }

   if (!reviewsQuery.data || reviewsQuery.data.reviews.length === 0) {
      return <div>No reviews available.</div>;
   }

   const currentSummary =
      summaryMutation.data?.summary || reviewsQuery.data.summary;
   return (
      <div>
         <div className="mb-5">
            <h2 className="text-2xl font-bold mb-2">Reviews</h2>
            {currentSummary ? (
               <div className="italic text-gray-600">{currentSummary}</div>
            ) : (
               <div>
                  <Button
                     onClick={() => summaryMutation.mutate()}
                     className="cursor-pointer"
                     disabled={summaryMutation.isPending}
                  >
                     <HiSparkles />
                     Summarize
                  </Button>
                  {summaryMutation.isPending && (
                     <div className="py-3">
                        <ReviewSkeleton />
                     </div>
                  )}
                  {summaryMutation.isError && (
                     <div className="text-red-500 mt-2">
                        Failed to summarize reviews. Please try again.
                     </div>
                  )}
               </div>
            )}
         </div>
         <div className="flex flex-col gap-5">
            {reviewsQuery.data?.reviews.map((review) => (
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
