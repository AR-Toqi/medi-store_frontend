import { ReviewStats } from "@/types/review";
import { Star } from "lucide-react";

interface ReviewStatsProps {
  stats: ReviewStats;
}

export function ReviewStatsComponent({ stats }: ReviewStatsProps) {
  const { averageRating, totalReviews, ratingDistribution } = stats;

  const distribution = [
    { rating: 5, count: ratingDistribution[5] },
    { rating: 4, count: ratingDistribution[4] },
    { rating: 3, count: ratingDistribution[3] },
    { rating: 2, count: ratingDistribution[2] },
    { rating: 1, count: ratingDistribution[1] },
  ];

  return (
    <div className="bg-white dark:bg-slate-800/60 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700/50 shadow-sm dark:shadow-none">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
            Average Rating
          </p>
          <div className="relative">
            <span className="text-7xl font-black text-slate-900 dark:text-slate-100 leading-none">
              {averageRating}
            </span>
            <div className="flex items-center justify-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-200 dark:text-slate-600"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
            Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          {distribution.map(({ rating, count }) => {
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
            return (
              <div key={rating} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-8">
                  <span className="text-sm font-black text-slate-700 dark:text-slate-300">{rating}</span>
                  <Star className="w-3 h-3 text-slate-400 fill-slate-400" />
                </div>
                <div className="flex-1 h-3 bg-slate-50 dark:bg-slate-700/50 rounded-full overflow-hidden border border-slate-100 dark:border-slate-600">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-400 w-10 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
