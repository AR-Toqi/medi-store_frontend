"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
  BriefcaseMedical,
  Mail,
  Lock,
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

import { authClient } from "@/lib/auth-client";
import { loginSchema, type LoginValues } from "@/zod/auth.validation";
import { useUser } from "@/hooks/use-user";
import { type User } from "@/types/auth";

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { setUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const callbackUrl = searchParams.get("callbackUrl");

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (value: LoginValues) => {
    setIsSubmitting(true);
    try {
      // Use a relative path so it goes through the Next.js rewrite
      // This is CRITICAL for cookies to be saved correctly.
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: value.email,
          password: value.password,
        }),
      });

      const result = await response.json();

      if (result.success && result.data?.user) {
        toast.success("Login successful");

        const user = result.data.user as User;

        // Update global state
        setUser(user);

        // Force fresh fetch to ensure state is synchronized
        await queryClient.invalidateQueries({ queryKey: ["user"] });
        
        const role = user.role;
        if (role === "ADMIN") {
          router.push("/admin");
        } else if (role === "SELLER") {
          router.push("/seller/dashboard");
        } else if (callbackUrl) {
          router.push(callbackUrl);
        } else {
          router.push("/");
        }
      } else {
        toast.error(result.message || "Invalid email or password.");
      }
    } catch (err: any) {
      toast.error("An unexpected error occurred during login.");
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

        <Card {...props} className="w-full border-none shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] bg-card/90 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <div className="p-8 md:p-12 lg:p-14">
            <CardHeader className="p-0 mb-10 space-y-2.5 text-left">
              <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
                Welcome Back
              </h2>
              <p className="text-muted-foreground font-medium">
                Enter your credentials to access your account.
              </p>
            </CardHeader>

            <CardContent className="p-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                  <div className="space-y-5">
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

                    {/* Password */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex justify-between items-center ml-1">
                            <FormLabel className="text-sm font-bold text-foreground/80">Password</FormLabel>
                            <Link
                              href="/forgot-password"
                              className="text-xs font-bold text-[#00bc8c] hover:underline"
                            >
                              Forgot password?
                            </Link>
                          </div>
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
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 text-base font-bold transition-all shadow-xl shadow-[#00bc8c]/10 active:scale-[0.98] bg-[#00bc8c] hover:bg-[#00a37b] rounded-xl text-white mt-4 disabled:opacity-50 disabled:bg-[#00bc8c]/40"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Logging in...
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </Button>

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-muted/30" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-4 text-muted-foreground font-black tracking-widest">Or continue with</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login/google`}
                    className="w-full h-14 text-base font-bold border-2 border-muted/20 hover:border-[#00bc8c]/30 hover:bg-[#00bc8c]/5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Sign in with Google
                  </Button>
                </form>
              </Form>

              <div className="mt-10 text-center text-sm">
                <p className="text-muted-foreground font-medium">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-[#00bc8c] font-bold hover:scale-105 inline-block transition-transform hover:underline"
                  >
                    Create Account
                  </Link>
                </p>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    );
  }
