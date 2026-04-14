"use client";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from '@tanstack/react-form';
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";


const formSchema = z.object({
  name: z
  .string()
  .min(2, "Name must be at least 2 characters long"),

email: z
  .string()
  .email("Invalid email address"),

password: z
  .string()
  .min(6, "Password must be at least 6 characters long"),

role: z.enum(["SELLER", "CUSTOMER", "ADMIN"]),
})
export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "SELLER" as "SELLER" | "CUSTOMER" | "ADMIN",
    },
    validators:{
      onSubmit: formSchema
    },
    onSubmit: async (values) => {
      console.log(values)
      console.log(process.env.NEXT_PUBLIC_API_URL);

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/sign-up/email`, 
          {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

         // Log raw response object
    console.log("📥 Raw Response:", res);
    console.log("📊 Status:", res.status);
    console.log("🧾 Status Text:", res.statusText);
    console.log("📦 Headers:", Object.fromEntries(res.headers.entries()));

        
     const message = await res.text();
     console.log("💬 Response Message:", message);
        if (!res.ok) {
           console.error("❌ Signup failed");
            toast.error(message || "Signup failed");
            return;
        }
         console.log("✅ Signup successful");
        toast.success("Signup successful 🎉");
        router.push("/login");
      } catch (err) {
        toast.error( "Server error. Please try again.");
      }
    },
  });
  return (
    <Card {...props} className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your details to create your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          <FieldGroup>
            {/* Name */}
            <form.Field name="name">
              {(field) => (
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input
                    placeholder="Abdullah Toqi"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors?.[0] && (
                    <FieldDescription className="text-red-500">
                      {field.state.meta.errors[0].message}
                    </FieldDescription>
                  )}
                </Field>
              )}
            </form.Field>

            {/* Email */}
            <form.Field name="email">
              {(field) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    placeholder="toqi@example.com"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors?.[0] && (
                    <FieldDescription className="text-red-500">
                      {field.state.meta.errors[0].message}
                    </FieldDescription>
                  )}
                </Field>
              )}
            </form.Field>

            {/* Password */}
            <form.Field name="password">
              {(field) => (
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    type="password"
                    placeholder="********"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errors?.[0] && (
                    <FieldDescription className="text-red-500">
                      {field.state.meta.errors[0].message}
                    </FieldDescription>
                  )}
                </Field>
              )}
            </form.Field>

            {/* Role */}
            <form.Field name="role">
  {(field) => (
    <Field>
      <FieldLabel>Role</FieldLabel>

      <select
        className="w-full border rounded-md px-3 py-2 text-sm"
        value={field.state.value}
        onChange={(e) =>
          field.handleChange(e.target.value as "SELLER" | "CUSTOMER")
        }
      >
        <option value="SELLER">Seller</option>
        <option value="CUSTOMER">Customer</option>
      </select>

      {field.state.meta.errors?.[0] && (
        <FieldDescription className="text-red-500">
          {field.state.meta.errors[0].message}
        </FieldDescription>
      )}
    </Field>
  )}
</form.Field>
          </FieldGroup>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={form.state.isSubmitting}
          >
            {form.state.isSubmitting ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
