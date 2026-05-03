import { Review } from "@/types/review";
import { Star, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReviewListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="bg-slate-50/50 dark:bg-slate-800/40 rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700/50">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl inline-block shadow-sm mb-4">
          <Star className="w-8 h-8 text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-2">No reviews yet</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Be the first to share your experience with this medicine!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white dark:bg-slate-800/60 rounded-[2rem] p-6 md:p-8 border border-slate-100 dark:border-slate-700/50 shadow-sm dark:shadow-none hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#00bc8c]/10 flex items-center justify-center border border-[#00bc8c]/20">
                <User className="w-6 h-6 text-[#00bc8c]" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900 dark:text-slate-100 leading-tight">
                  {review.user.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          star <= review.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-slate-200 dark:text-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {formatDistanceToNow(new Date(review.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="pl-16">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {review.comment}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
