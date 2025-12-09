import React from 'react';
import { FaRegStar, FaStar } from 'react-icons/fa';

type Props = {
   value: number; // rating value between 0 and 5
};

const StarRating = ({ value }: Props) => {
   const placeholder = [1, 2, 3, 4, 5];

   return (
      <div className="flex gap-1 text-yellow-500">
         {placeholder.map((p) =>
            p <= value ? <FaStar key={p} /> : <FaRegStar key={p} />
         )}
      </div>
   );
};

export default StarRating;
