"use client";

import { verifyEmailAction } from "@/app/(commonLayout)/(auth)/verify-email/_action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { verifyEmailSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { 
  BriefcaseMedical, 
  ShieldCheck, 
  Mail, 
  ArrowLeft
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import React, { useEffect } from "react";

export function VerifyEmailForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const form = useForm({
    defaultValues: {
      email: email,
      code: "",
    },
    validators: {
      onChange: verifyEmailSchema,
    },
    onSubmit: async ({ value }) => {
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
      }
    },
  });

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

      <Card {...props} className="w-full border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] bg-card/90 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-7"
            >
              <div className="space-y-5">
                {/* OTP Code */}
                <form.Field
                  name="code"
                  children={(field) => (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center ml-1">
                        <FieldLabel className="text-sm font-bold text-foreground/80">Verification Code</FieldLabel>
                        <span className="text-[10px] font-black tracking-widest text-[#00bc8c] uppercase">6 digits</span>
                      </div>
                      <Input
                        icon={<ShieldCheck />}
                        placeholder="000000"
                        maxLength={6}
                        className="text-center text-2xl tracking-[0.5em] font-mono h-16 py-0 flex items-center"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          if (val.length <= 6) field.handleChange(val);
                        }}
                      />
                      <FieldError errors={field.state.meta.errors} className="ml-1" />
                    </div>
                  )}
                />
              </div>

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="w-full h-14 text-base font-bold transition-all shadow-xl shadow-[#00bc8c]/10 active:scale-[0.98] bg-[#00bc8c] hover:bg-[#00a37b] rounded-xl text-white mt-4 disabled:opacity-50 disabled:bg-[#00bc8c]/40"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Verifying...
                      </div>
                    ) : (
                      "Verify Account"
                    )}
                  </Button>
                )}
              />
            </form>

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
