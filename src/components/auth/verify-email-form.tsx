"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { 
  BriefcaseMedical, 
  ShieldCheck, 
  Mail, 
  ArrowLeft,
  Loader2
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

import { verifyEmailAction } from "@/app/(commonLayout)/(auth)/verify-email/_action";
import { verifyEmailSchema, type VerifyEmailValues } from "@/zod/auth.validation";

export function VerifyEmailForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      email: email,
      code: "",
    },
  });

  const onSubmit = async (value: VerifyEmailValues) => {
    setIsSubmitting(true);
    try {
      const result = await verifyEmailAction(value);

      if (result.success) {
        toast.success(result.message);
        router.push("/login");
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err.message || "Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="bg-[#00bc8c15] p-3.5 rounded-2xl mb-5 shadow-sm border border-[#00bc8c20]">
          <BriefcaseMedical className="w-10 h-10 text-[#00bc8c]" strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-foreground mb-1">
          MediStore
        </h1>
        <p className="text-muted-foreground font-medium text-lg">
          Secure Account Verification
        </p>
      </div>

      <Card {...props} className="w-full border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] bg-card/90 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
        <div className="p-8 md:p-12 lg:p-14">
          <CardHeader className="p-0 mb-10 space-y-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
              Verify your email
            </h2>
            <div className="space-y-1">
              <p className="text-muted-foreground font-medium">
                We've sent a 6-digit verification code to
              </p>
              <p className="text-foreground font-bold flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00bc8c]" />
                {email || "your email address"}
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                <div className="space-y-5">
                  {/* OTP Code */}
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center ml-1">
                          <FormLabel className="text-sm font-bold text-foreground/80">Verification Code</FormLabel>
                          <span className="text-[10px] font-black tracking-widest text-[#00bc8c] uppercase">6 digits</span>
                        </div>
                        <FormControl>
                          <Input
                            icon={<ShieldCheck />}
                            placeholder="000000"
                            maxLength={6}
                            className="text-center text-2xl tracking-[0.5em] font-mono h-16 py-0 flex items-center"
                            {...field}
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9]/g, "");
                              if (val.length <= 6) field.onChange(val);
                            }}
                          />
                        </FormControl>
                        <FormMessage className="ml-1" />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 text-base font-bold transition-all shadow-xl shadow-[#00bc8c]/10 active:scale-[0.98] bg-[#00bc8c] hover:bg-[#00a37b] rounded-xl text-white mt-4 disabled:opacity-50 disabled:bg-[#00bc8c]/40"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                       <Loader2 className="h-5 w-5 animate-spin" />
                       Verifying...
                    </div>
                  ) : (
                    "Verify Account"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-10 flex flex-col items-center gap-4 text-sm">
              <p className="text-muted-foreground font-medium">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  className="text-[#00bc8c] font-bold hover:underline"
                  onClick={() => toast.info("Check your spam folder or try again.")}
                >
                  Resend Code
                </button>
              </p>
              
              <Link
                href="/signup"
                className="flex items-center gap-2 text-muted-foreground/60 hover:text-foreground transition-colors font-bold uppercase tracking-wider text-[10px]"
              >
                <ArrowLeft className="w-3 h-3" />
                Back to Sign Up
              </Link>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
