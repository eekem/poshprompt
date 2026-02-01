"use client";

import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const router = useRouter();
  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[520px] bg-white dark:bg-[#27231b]/40 backdrop-blur-md rounded-xl p-8 border border-slate-200 dark:border-primary/10 amber-border-glow shadow-2xl text-center">
          {/* Glowing Amber Graphic */}
          <div className="mb-8 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-125"></div>
              <div className="relative bg-primary/10 p-6 rounded-full border border-primary/30">
                <span
                  className="material-symbols-outlined text-primary text-[64px] amber-glow"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 200, 'GRAD' 0, 'opsz' 48" }}
                >
                  mail
                </span>
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight mb-4">
            Verify Your Email
          </h1>

          {/* Description */}
          <p className="text-slate-600 dark:text-[#bab09c] text-base leading-relaxed mb-8 px-4">
            We've sent a code to your inbox to secure your{" "}
            <span className="text-primary font-medium">prompt arena</span> access. Please check your email to complete registration.
          </p>

          {/* User Email Card */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 dark:bg-[#27231b] p-5 border border-slate-200 dark:border-white/5 shadow-inner">
              <div className="flex flex-col gap-1 items-start text-left">
                <p className="text-slate-900 dark:text-white text-base font-bold leading-tight">
                  alexander.v@creative-agency.com
                </p>
                <p className="text-slate-500 dark:text-[#bab09c] text-sm font-normal">
                  Pending verification...
                </p>
              </div>
              <div className="size-10 flex items-center justify-center bg-primary/20 rounded-lg text-primary">
                <span className="material-symbols-outlined text-xl">mark_email_unread</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold text-lg py-4 rounded-lg transition-all duration-200 transform active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mb-6">
            <span className="material-symbols-outlined">refresh</span>
            Resend Verification Email
          </button>

          {/* Footer Links */}
          <div className="flex flex-col gap-3">
            <p className="text-slate-500 dark:text-[#bab09c] text-sm">
              Didn't receive the email? Check your spam folder.
            </p>
            <div className="flex justify-center gap-6 mt-4">
              <button
                className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
                onClick={() => router.push('/register')}
              >
                <span className="material-symbols-outlined text-sm">edit</span>
                Change Email
              </button>
              <button
                className="text-slate-400 dark:text-[#8b8474] text-sm font-semibold hover:underline flex items-center gap-1"
                onClick={() => router.push('/support')}
              >
                <span className="material-symbols-outlined text-sm">help</span>
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Subtle Brand Background Element */}
        <div className="mt-12 opacity-30 select-none pointer-events-none">
          <div className="flex items-center gap-2 grayscale brightness-50 contrast-125">
            <span className="material-symbols-outlined text-primary text-sm">shield</span>
            <span className="text-xs tracking-widest uppercase font-medium">
              PoshPrompt Secure Arena Integration
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Graphic (Abstract) */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent"></div>
    </Layout>
  );
}
