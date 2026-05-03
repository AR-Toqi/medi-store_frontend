"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { 
  BriefcaseMedical, 
  Mail, 
  ArrowLeft,
  Loader2,
  Send
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
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/zod/auth.validation";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (value: ForgotPasswordValues) => {
    setIsSubmitting(true);
    try {
      const result = await authService.forgotPassword(value);

      if (result.success) {
        toast.success(result.message || "OTP sent to your email!");
        // Redirect to reset-password with email in query param
        router.push(`/reset-password?email=${encodeURIComponent(value.email)}`);
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset code. Please try again.");
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
          Forgot Password?
        </p>
      </div>

      <Card className="w-full border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] bg-card/90 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
        <div className="p-8 md:p-12 lg:p-14">
          <CardHeader className="p-0 mb-10 space-y-2.5 text-left">
            <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
              Reset Your Password
            </h2>
            <p className="text-muted-foreground font-medium">
              Enter your email address and we'll send you an OTP to reset your password.
            </p>
          </CardHeader>

          <CardContent className="p-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-bold text-foreground/80 ml-1">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          icon={<Mail />}
                          placeholder="name@company.com"
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
                       Sending...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Send Reset OTP
                      <Send className="w-4 h-4" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-10 text-center text-sm">
              <Link
                href="/login"
                className="text-muted-foreground font-bold hover:text-[#00bc8c] flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
