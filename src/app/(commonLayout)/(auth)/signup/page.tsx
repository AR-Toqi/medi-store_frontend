import { SignupForm } from "@/components/auth/signup-form"
import Link from "next/link"

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10 overflow-hidden bg-[#fbfcfd] text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00bc8c]/5 dark:bg-[#00bc8c]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00bc8c]/5 dark:bg-[#00bc8c]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-xl z-10 pt-10">
        <SignupForm />
      </div>
    </div>
  )
}
