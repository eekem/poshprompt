"use client";

import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-b from-background-light to-[#f0efe9] dark:from-background-dark dark:to-[#12110d]">
        <div className="max-w-[480px] w-full bg-white dark:bg-[#27231b] p-8 md:p-10 rounded-xl shadow-2xl border border-[#e5e7eb] dark:border-[#393328]">
          <div className="flex justify-center mb-6">
            <div className="size-14 bg-primary/20 rounded-full flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl!">lock_reset</span>
            </div>
          </div>

          {/* Headline Section */}
          <h1 className="text-center text-2xl md:text-3xl font-bold mb-2 font-display">
            Create New Password
          </h1>
          <p className="text-[#6b7280] dark:text-[#bab09c] text-sm text-center mb-8">
            Your new password must be different from previous used passwords.
          </p>

          {/* Form Section */}
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* New Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                New Password
              </label>
              <div className="relative flex w-full items-stretch rounded-lg shadow-sm">
                <input
                  className="form-input flex w-full min-w-0 flex-1 rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#544c3b] bg-[#27231b] focus:border-primary h-14 placeholder:text-[#bab09c]/50 px-4 text-base font-normal"
                  placeholder="••••••••"
                  type="password"
                  defaultValue="PoshAI_2024!"
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bab09c] hover:text-primary transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>

            {/* Password Strength Component */}
            <div className="bg-[#f8f7f5]/10 dark:bg-black/20 p-4 rounded-lg border border-[#544c3b]/30">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium">
                    Strength: <span className="text-primary">Medium</span>
                  </p>
                  <p className="text-xs font-bold text-primary">65%</p>
                </div>
                <div className="h-1.5 w-full bg-[#544c3b] rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: "65%" }}></div>
                </div>
                <p className="text-[#bab09c] text-xs mt-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs!">info</span>
                  Add a special character to make it stronger.
                </p>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Confirm New Password
              </label>
              <div className="relative flex w-full items-stretch rounded-lg shadow-sm">
                <input
                  className="form-input flex w-full min-w-0 flex-1 rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#544c3b] bg-[#27231b] focus:border-primary h-14 placeholder:text-[#bab09c]/50 px-4 text-base font-normal"
                  placeholder="••••••••"
                  type="password"
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#bab09c] hover:text-primary transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>

            {/* Requirement List (Visual Only) */}
            <ul className="grid grid-cols-2 gap-2 text-xs text-[#bab09c]">
              <li className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-[14px]!">check_circle</span>
                At least 8 characters
              </li>
              <li className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-[14px]!">check_circle</span>
                One uppercase letter
              </li>
              <li className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]!">radio_button_unchecked</span>
                One special character
              </li>
              <li className="flex items-center gap-1.5 text-primary">
                <span className="material-symbols-outlined text-[14px]!">check_circle</span>
                One number
              </li>
            </ul>

            {/* Primary Action */}
            <button className="w-full flex items-center justify-center rounded-lg h-14 bg-primary text-background-dark text-base font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/20">
              Update Password
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              className="text-sm text-[#bab09c] hover:text-primary transition-colors flex items-center justify-center gap-1 font-medium"
              onClick={() => router.push('/login')}
            >
              <span className="material-symbols-outlined text-sm!">arrow_back</span>
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
