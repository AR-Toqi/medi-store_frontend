import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default function ResetPasswordPage() {
  return (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10 overflow-hidden bg-[#fbfcfd]">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00bc8c]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00bc8c]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl z-10 pt-10">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="w-10 h-10 text-[#00bc8c] animate-spin mb-4" />
            <p className="text-slate-500 font-bold">Loading reset form...</p>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
