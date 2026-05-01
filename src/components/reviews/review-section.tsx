"use client";

import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/services/review.service";
import { ReviewStatsComponent } from "./review-stats";
import { ReviewList } from "./review-list";
import { ReviewForm } from "./review-form";
import { useUser } from "@/hooks/use-user";
import { MessageSquare, Star, Info, LogIn } from "lucide-react";
import Link from "next/link";

interface ReviewSectionProps {
  medicineId: string;
}

export function ReviewSection({ medicineId }: ReviewSectionProps) {
  const { user } = useUser();

  const {
    data: stats,
    isLoading: isStatsLoading,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["review-stats", medicineId],
    queryFn: () => reviewService.getMedicineStats(medicineId),
  });

  const {
    data: reviewData,
    isLoading: isReviewsLoading,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ["reviews", medicineId],
    queryFn: () => reviewService.getReviewsByMedicine(medicineId),
  });

  const handleReviewSuccess = () => {
    refetchStats();
    refetchReviews();
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#00bc8c] font-black uppercase tracking-widest text-xs">
              <MessageSquare className="w-4 h-4" />
              Customer Feedback
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Patient Reviews
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-black text-slate-700">
              {stats?.averageRating || 0} Average
            </span>
            <span className="text-slate-300 mx-1">|</span>
            <span className="text-sm font-bold text-slate-500">
              {stats?.totalReviews || 0} Reviews
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Stats & Reviews */}
          <div className="lg:col-span-7 space-y-12">
            {isStatsLoading ? (
              <div className="h-64 bg-slate-50 animate-pulse rounded-[2.5rem]" />
            ) : (
              stats && <ReviewStatsComponent stats={stats} />
            )}

            <div className="space-y-8">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                All Reviews
                <span className="bg-slate-100 text-slate-500 text-xs px-2.5 py-1 rounded-lg">
                  {stats?.totalReviews || 0}
                </span>
              </h3>
              {isReviewsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-32 bg-slate-50 animate-pulse rounded-[2rem]"
                    />
                  ))}
                </div>
              ) : (
                <ReviewList reviews={reviewData?.reviews || []} />
              )}
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              {user ? (
                <div className="space-y-4">
                  <ReviewForm
                    medicineId={medicineId}
                    onSuccess={handleReviewSuccess}
                  />
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                    <Info className="w-5 h-5 text-blue-500 shrink-0" />
                    <p className="text-xs text-blue-700 font-medium leading-relaxed">
                      Only customers who have purchased this medicine can leave a
                      review. Your review will be public and linked to your name.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-[#00bc8c] opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity duration-500" />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/20">
                      <Star className="w-8 h-8 text-[#00bc8c] fill-[#00bc8c]" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black tracking-tight">
                        Log in to Review
                      </h3>
                      <p className="text-slate-400 font-medium text-sm leading-relaxed">
                        Purchased this medicine? Log in to your account to share
                        your thoughts and help other patients.
                      </p>
                    </div>
                    <Link
                      href="/login"
                      className="inline-flex items-center gap-3 bg-[#00bc8c] hover:bg-white hover:text-slate-900 text-white font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all active:scale-95 group"
                    >
                      Login Now
                      <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
