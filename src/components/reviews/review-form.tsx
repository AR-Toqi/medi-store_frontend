"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star, Send, Loader2 } from "lucide-react";
import { reviewService } from "@/services/review.service";
import { toast } from "sonner";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().min(5, "Comment must be at least 5 characters").max(500),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  medicineId: string;
  onSuccess: () => void;
}

export function ReviewForm({ medicineId, onSuccess }: ReviewFormProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const rating = watch("rating");

  const onSubmit = async (data: ReviewFormValues) => {
    setIsSubmitting(true);
    try {
      await reviewService.createReview({
        medicineId,
        rating: data.rating,
        comment: data.comment,
      });
      toast.success("Review submitted successfully!");
      reset();
      onSuccess();
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to submit review";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
      <div className="space-y-2 mb-8 text-center md:text-left">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Write a Review
        </h3>
        <p className="text-slate-500 font-medium">
          Share your experience with this medicine to help others.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Star Rating */}
        <div className="space-y-3">
          <label className="text-sm font-black text-slate-700 uppercase tracking-wider block">
            Your Rating
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-110 active:scale-95 outline-none"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(null)}
                onClick={() => setValue("rating", star, { shouldValidate: true })}
              >
                <Star
                  className={`w-10 h-10 ${
                    star <= (hoveredRating ?? rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-200"
                  } transition-colors duration-200`}
                />
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className="text-red-500 text-xs font-bold mt-1">
              {errors.rating.message}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="space-y-3">
          <label className="text-sm font-black text-slate-700 uppercase tracking-wider block">
            Your Experience
          </label>
          <textarea
            {...register("comment")}
            placeholder="What did you think of this medicine? Was it effective?"
            rows={4}
            className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-5 text-slate-700 font-medium placeholder:text-slate-400 focus:ring-4 focus:ring-[#00bc8c]/10 focus:border-[#00bc8c] outline-none transition-all resize-none"
          />
          {errors.comment && (
            <p className="text-red-500 text-xs font-bold mt-1">
              {errors.comment.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto bg-[#00bc8c] hover:bg-[#009c74] disabled:bg-slate-300 text-white font-black uppercase tracking-widest px-10 py-5 rounded-2xl shadow-lg shadow-[#00bc8c]/20 flex items-center justify-center gap-3 transition-all active:scale-95 group"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Submit Review
              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
