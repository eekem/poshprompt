"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative">
        {/* Background Decoration */}
        <div className="fixed inset-0 pointer-events-none z-0 particle-bg"></div>
        <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-[480px]">
          <div className="glass-panel p-8 lg:p-12 rounded-xl shadow-2xl">
            {/* Headline */}
            <div className="mb-8">
              <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight text-center pb-2">
                Secure Access Login
              </h1>
              <p className="text-white/50 text-center text-sm">
                Enter the arena of premium AI engineering
              </p>
            </div>

            <form className="space-y-4">
              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <p className="text-white/80 text-sm font-medium leading-normal">
                  Email Address
                </p>
                <input
                  className="form-input w-full rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-white/10 bg-white/5 focus:border-primary h-14 placeholder:text-white/20 p-4 text-base font-normal transition-all"
                  placeholder="name@company.com"
                  type="email"
                />
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-white/80 text-sm font-medium leading-normal">
                    Password
                  </p>
                </div>
                <div className="relative flex w-full items-stretch rounded-lg">
                  <input
                    className="form-input w-full rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-white/10 bg-white/5 focus:border-primary h-14 placeholder:text-white/20 p-4 pr-12 text-base font-normal transition-all"
                    placeholder="••••••••"
                    type="password"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 cursor-pointer hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">visibility</span>
                  </div>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end pt-1 pb-4">
                <Link
                  className="text-primary text-xs font-semibold tracking-wide uppercase hover:underline cursor-pointer"
                  href="/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                className="w-full bg-primary text-background-dark font-bold py-4 rounded-lg hover:bg-primary/90 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(244,175,37,0.2)]"
                type="submit"
              >
                <span>Sign In</span>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                  login
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center py-8">
              <div className="grow border-t border-white/5"></div>
              <span className="shrink mx-4 text-white/30 text-xs font-medium uppercase tracking-widest">
                Or continue with
              </span>
              <div className="grow border-t border-white/5"></div>
            </div>

            {/* Social Login Options */}
            <div className="grid grid-cols-3 gap-4">
              {/* Google */}
              <button className="flex items-center justify-center h-14 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group">
                <svg className="w-6 h-6 text-white/70 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.184 1.184-3.04 2.48-6.392 2.48-5.144 0-9.232-4.136-9.232-9.28s4.088-9.28 9.232-9.28c2.8 0 4.848 1.112 6.328 2.528l2.312-2.312C18.736 1.048 15.936 0 12.48 0 5.864 0 .424 5.376.424 12s5.44 12 12.056 12c3.568 0 6.328-1.184 8.416-3.328 2.168-2.168 2.848-5.216 2.848-7.76 0-.544-.048-1.072-.128-1.6h-11.12z"></path>
                </svg>
              </button>

              {/* TikTok */}
              <button className="flex items-center justify-center h-14 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group">
                <svg className="w-6 h-6 text-white/70 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a6.38 6.38 0 0 1-1.85-1.57v8.91c.03 2.12-.51 4.31-2.01 5.88-1.63 1.77-4.11 2.57-6.42 2.21-2.32-.36-4.47-1.95-5.38-4.11-.93-2.19-.74-4.81.65-6.75 1.25-1.78 3.42-2.8 5.6-2.61v4.03c-1.3-.18-2.73.23-3.66 1.19-.94.96-1.16 2.45-.53 3.63.63 1.18 2.05 1.93 3.39 1.76 1.34-.17 2.45-1.25 2.62-2.6.02-1.18.01-8.59.01-9.76-.01-1.3-.01-2.6.01-3.9z"></path>
                </svg>
              </button>

              {/* X / Twitter */}
              <button className="flex items-center justify-center h-14 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group">
                <svg className="w-5 h-5 text-white/70 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z"></path>
                </svg>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-white/40 text-xs">
                By logging in, you agree to our{" "}
                <button className="underline hover:text-white transition-colors" onClick={() => router.push('/terms')}>
                  Terms of Service
                </button>{" "}
                and{" "}
                <button className="underline hover:text-white transition-colors" onClick={() => router.push('/privacy')}>
                  Privacy Policy
                </button>
                .
              </p>
            </div>
          </div>

          {/* Technical Specs Footer */}
          <div className="mt-12 flex items-center gap-8 text-white/20 text-[10px] uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary/40 animate-pulse"></span>
              <span>AI Engine Active v4.2</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-green-500/40"></span>
              <span>Server Status: Optimal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[12px]">shield_lock</span>
              <span>256-Bit Encrypted</span>
            </div>
          </div>
        </div>

        {/* Background Pattern Element */}
        <div className="fixed bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>
      </div>
    </Layout>
  );
}
