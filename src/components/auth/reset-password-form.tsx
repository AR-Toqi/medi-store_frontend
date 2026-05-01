"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { 
  BriefcaseMedical, 
  Lock, 
  KeyRound,
  ArrowLeft,
  Loader2,
  CheckCircle2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { authService } from "@/services/auth.service";
import { resetPasswordSchema, type ResetPasswordValues } from "@/zod/auth.validation";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const email = searchParams.get("email") || "";

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: email,
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Update email if it comes from searchParams after initial load
  useEffect(() => {
    if (email) {
      form.setValue("email", email);
    }
  }, [email, form]);

  const onSubmit = async (value: ResetPasswordValues) => {
    setIsSubmitting(true);
    try {
      const result = await authService.resetPassword({
        email: value.email,
        otp: value.code,
        password: value.newPassword,
      });

      if (result.success) {
        toast.success(result.message || "Password reset successful!");
        router.push("/login?message=password_reset_success");
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password. Please check the code and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="bg-[#00bc8c15] p-3.5 rounded-2xl mb-5 shadow-sm border border-[#00bc8c20]">
          <BriefcaseMedical className="w-10 h-10 text-[#00bc8c]" strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-foreground mb-1">
          MediStore
        </h1>
        <p className="text-muted-foreground font-medium text-lg">
          Reset Password
        </p>
      </div>

      <Card className="w-full border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] bg-card/90 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
        <div className="p-8 md:p-12 lg:p-14">
          <CardHeader className="p-0 mb-10 space-y-2.5 text-left">
            <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
              Create New Password
            </h2>
            <p className="text-muted-foreground font-medium">
              Enter the OTP sent to <b>{email}</b> and your new password.
            </p>
          </CardHeader>

          <CardContent className="p-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Hidden Email Field (but validated) */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <input type="hidden" {...field} />
                  )}
                />

                {/* OTP Code */}
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold text-foreground/80 ml-1">OTP Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123456"
                          icon={<KeyRound />}
                          maxLength={6}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="ml-1" />
                    </FormItem>
                  )}
                />

                {/* New Password */}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold text-foreground/80 ml-1">New Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          icon={<Lock />}
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="ml-1" />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold text-foreground/80 ml-1">Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          icon={<CheckCircle2 />}
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="ml-1" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 text-base font-bold transition-all shadow-xl shadow-[#00bc8c]/10 active:scale-[0.98] bg-[#00bc8c] hover:bg-[#00a37b] rounded-xl text-white mt-4 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                       <Loader2 className="h-5 w-5 animate-spin" />
                       Resetting...
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-10 text-center text-sm">
              <Link
                href="/forgot-password"
                className="text-muted-foreground font-bold hover:text-[#00bc8c] flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Resend OTP
              </Link>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
