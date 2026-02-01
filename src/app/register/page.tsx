"use client";

import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center relative py-12 px-4 overflow-hidden ai-bg-pattern">
        {/* Abstract AI Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]"></div>
        </div>
        
        <div className="flex flex-col w-full max-w-[500px] z-10">
          {/* Glass Registration Card */}
          <div className="glass-card rounded-xl p-8 md:p-10 shadow-2xl">
            {/* Page Heading */}
            <div className="flex flex-col gap-2 mb-8 text-center md:text-left">
              <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                Join the Elite
              </h1>
              <p className="text-[#bab09c] text-base font-normal">
                Step into the future of Prompt Engineering.
              </p>
            </div>

            <form className="flex flex-col gap-5">
              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label className="text-white text-sm font-medium leading-none">
                  Email Address
                </label>
                <input
                  className="form-input flex w-full rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-[#544c3b] bg-[#27231b] h-12 placeholder:text-[#bab09c]/60 px-4 text-base font-normal transition-all"
                  placeholder="email@example.com"
                  type="email"
                />
              </div>

              {/* Username Field */}
              <div className="flex flex-col gap-2">
                <label className="text-white text-sm font-medium leading-none">
                  Username
                </label>
                <input
                  className="form-input flex w-full rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-[#544c3b] bg-[#27231b] h-12 placeholder:text-[#bab09c]/60 px-4 text-base font-normal transition-all"
                  placeholder="MasterPrompter"
                  type="text"
                />
              </div>

              {/* Password Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm font-medium leading-none">
                    Password
                  </label>
                  <input
                    className="form-input flex w-full rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-[#544c3b] bg-[#27231b] h-12 placeholder:text-white/20 px-4 text-base font-normal"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-white text-sm font-medium leading-none">
                    Confirm
                  </label>
                  <input
                    className="form-input flex w-full rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-[#544c3b] bg-[#27231b] h-12 placeholder:text-white/20 px-4 text-base font-normal"
                    placeholder="••••••••"
                    type="password"
                  />
                </div>
              </div>

              {/* Main Register Button */}
              <button
                className="mt-4 flex w-full cursor-pointer items-center justify-center rounded-lg h-14 px-4 bg-primary text-background-dark text-lg font-bold transition-transform active:scale-[0.98] shadow-lg shadow-primary/20"
                type="submit"
              >
                Create Account
              </button>

              {/* Divider */}
              <div className="relative py-4 flex items-center">
                <div className="grow border-t border-[#393328]"></div>
                <span className="shrink mx-4 text-[#bab09c] text-xs font-bold uppercase tracking-widest">
                  Or continue with
                </span>
                <div className="grow border-t border-[#393328]"></div>
              </div>

              {/* Social Sign-up Section */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  className="flex flex-col items-center justify-center gap-2 h-20 rounded-lg border border-[#393328] bg-[#27231b]/50 hover:bg-[#393328] transition-colors group"
                  type="button"
                >
                  <span className="material-symbols-outlined text-white group-hover:text-primary">
                    google
                  </span>
                  <span className="text-[10px] text-[#bab09c] uppercase font-bold tracking-tighter">
                    Google
                  </span>
                </button>

                <button
                  className="flex flex-col items-center justify-center gap-2 h-20 rounded-lg border border-[#393328] bg-[#27231b]/50 hover:bg-[#393328] transition-colors group"
                  type="button"
                >
                  <svg
                    className="w-5 h-5 fill-white group-hover:fill-primary"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.03 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.31-.75.42-1.24 1.25-1.33 2.1-.1.7.1 1.41.53 1.95.4.49 1.03.75 1.66.73 1.26.03 2.38-.93 2.45-2.18.02-4.12.03-8.24.02-12.36z"></path>
                  </svg>
                  <span className="text-[10px] text-[#bab09c] uppercase font-bold tracking-tighter">
                    TikTok
                  </span>
                </button>

                <button
                  className="flex flex-col items-center justify-center gap-2 h-20 rounded-lg border border-[#393328] bg-[#27231b]/50 hover:bg-[#393328] transition-colors group"
                  type="button"
                >
                  <svg
                    className="w-5 h-5 fill-white group-hover:fill-primary"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                  </svg>
                  <span className="text-[10px] text-[#bab09c] uppercase font-bold tracking-tighter">
                    Twitter (X)
                  </span>
                </button>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-[#bab09c] text-sm">
                Already have an account?{" "}
                <button className="text-primary font-bold hover:underline ml-1" onClick={() => router.push('/login')}>
                  Login
                </button>
              </p>
            </div>
          </div>

          {/* AI High-Tech Visual Feature */}
          <div className="mt-8 flex justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">psychology</span>
              <span className="text-white text-[10px] uppercase font-bold tracking-[0.2em]">
                Neural Engine
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">verified_user</span>
              <span className="text-white text-[10px] uppercase font-bold tracking-[0.2em]">
                Elite Access
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
