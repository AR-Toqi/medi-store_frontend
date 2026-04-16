"use client";

import { signUpAction } from "@/app/(commonLayout)/(auth)/signup/_action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signupSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { 
  BriefcaseMedical, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  BadgeCheck, 
  CreditCard
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import React from "react";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onChange: signupSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await signUpAction(value);

        if (result.success) {
          toast.success(result.message);
          router.push("/login");
        } else {
          toast.error(result.message);
        }
      } catch (err: any) {
        toast.error(err.message || "An unexpected error occurred. Please try again.");
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
          Trusted Online Medicine Shop
        </p>
      </div>

      <Card {...props} className="w-full border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] bg-card/90 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
        <div className="p-8 md:p-12 lg:p-14">
          <CardHeader className="p-0 mb-10 space-y-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
              Create your account
            </h2>
            <p className="text-muted-foreground font-medium text-lg">
              Join our community for better healthcare access.
            </p>
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
                {/* Full Name */}
                <form.Field
                  name="name"
                  children={(field) => (
                    <div className="space-y-2">
                      <FieldLabel className="text-sm font-bold text-foreground/80 ml-1">Full Name</FieldLabel>
                      <Input
                        icon={<User />}
                        placeholder="John Doe"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError errors={field.state.meta.errors} className="ml-1" />
                    </div>
                  )}
                />

                {/* Email Address */}
                <form.Field
                  name="email"
                  children={(field) => (
                    <div className="space-y-2">
                      <FieldLabel className="text-sm font-bold text-foreground/80 ml-1">Email Address</FieldLabel>
                      <Input
                        type="email"
                        icon={<Mail />}
                        placeholder="name@company.com"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError errors={field.state.meta.errors} className="ml-1" />
                    </div>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Password */}
                  <form.Field
                    name="password"
                    children={(field) => (
                      <div className="space-y-2">
                        <FieldLabel className="text-sm font-bold text-foreground/80 ml-1">Password</FieldLabel>
                        <Input
                          type="password"
                          icon={<Lock />}
                          placeholder="••••••••"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldError errors={field.state.meta.errors} className="ml-1" />
                      </div>
                    )}
                  />

                  {/* Confirm Password */}
                  <form.Field
                    name="confirmPassword"
                    children={(field) => (
                      <div className="space-y-2">
                        <FieldLabel className="text-sm font-bold text-foreground/80 ml-1">Confirm Password</FieldLabel>
                        <Input
                          type="password"
                          icon={<ShieldCheck />}
                          placeholder="••••••••"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldError errors={field.state.meta.errors} className="ml-1" />
                      </div>
                    )}
                  />
                </div>


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
                        Creating Account...
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                )}
              />
            </form>

            <div className="mt-10 text-center text-sm">
              <p className="text-muted-foreground font-medium">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#00bc8c] font-bold hover:scale-105 inline-block transition-transform hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Trust Footer */}
      <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 mt-14 text-[11px] font-black tracking-[0.15em] text-muted-foreground/40 uppercase animate-in fade-in duration-1000 delay-500 fill-mode-both">
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 opacity-70" />
          SECURE PAYMENT
        </div>
        <div className="flex items-center gap-3">
          <BadgeCheck className="w-5 h-5 opacity-70" />
          CERTIFIED MEDS
        </div>
      </div>
    </div>
  );
}
