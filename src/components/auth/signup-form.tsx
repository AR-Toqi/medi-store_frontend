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
  Lock, 
  User, 
  ShieldCheck, 
  BadgeCheck, 
  CreditCard,
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

import { signUpAction } from "@/app/(commonLayout)/(auth)/signup/_action";
import { signupSchema, type SignupValues } from "@/zod/auth.validation";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (value: SignupValues) => {
    setIsSubmitting(true);
    try {
      const result = await signUpAction(value);

      if (result.success) {
        toast.success(result.message);
        router.push(`/verify-email?email=${value.email}`);
      } else {
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred. Please try again.");
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                <div className="space-y-5">
                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-foreground/80 ml-1">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            icon={<User />}
                            placeholder="John Doe"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="ml-1" />
                      </FormItem>
                    )}
                  />

                  {/* Email Address */}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold text-foreground/80 ml-1">Password</FormLabel>
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
                              icon={<ShieldCheck />}
                              placeholder="••••••••"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="ml-1" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 text-base font-bold transition-all shadow-xl shadow-[#00bc8c]/10 active:scale-[0.98] bg-[#00bc8c] hover:bg-[#00a37b] rounded-xl text-white mt-4 disabled:opacity-50 disabled:bg-[#00bc8c]/40"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                       <Loader2 className="h-5 w-5 animate-spin" />
                       Creating Account...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>

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
