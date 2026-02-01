"use client";

import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import TikTokLogo from "@/components/TikTok";
import PasswordInput from "@/components/PasswordInput";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-6 bg-mesh pt-30">
        {/* Abstract AI Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]"></div>
        </div>
        
        <div className="flex flex-col w-full max-w-[480px] z-10">
          <div className="bg-surface-dark/40 backdrop-blur-xl border border-border-dark p-8 md:p-12 rounded-xl shadow-2xl">
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

              {/* Password Fields */}
              <div className="space-y-4">
                <PasswordInput
                  id="password"
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  showStrength={true}
                  required={true}
                />
                <PasswordInput
                  id="confirm-password"
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  required={true}
                />
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
                  <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-[10px] text-[#bab09c] uppercase font-bold tracking-tighter">
                    Google
                  </span>
                </button>

                <button
                  className="flex flex-col items-center justify-center gap-2 h-20 rounded-lg border border-[#393328] bg-[#27231b]/50 hover:bg-[#393328] transition-colors group"
                  type="button"
                >
                  <TikTokLogo className="w-6 h-6" />
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
