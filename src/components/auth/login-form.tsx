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

import { loginAction } from "@/app/(commonLayout)/(auth)/login/_action";
import { loginSchema, type LoginValues } from "@/zod/auth.validation";
import { useUser } from "@/hooks/use-user";

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
      const result = await loginAction(value);

      if (result.success) {
        toast.success(result.message);
        
        // Immediately update global state
        if (result.data?.user) {
          setUser(result.data.user);
        }

        // Force fresh fetch to ensure cookies are synchronized
        await queryClient.invalidateQueries({ queryKey: ["user"] });
        
        const role = result.data?.user?.role || result.data?.role;
        
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
        toast.error(result.message);
      }
    } catch (err: any) {
      toast.error(err.message || "Login failed. Please check your credentials.");
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
