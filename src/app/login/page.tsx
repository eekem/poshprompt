"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TikTokLogo from "@/components/TikTok";
import { useState, useEffect } from "react";
import { authClient } from "@/app/lib/auth-client";
import { useAuth } from "@/app/lib/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect authenticated users to challenge page
  useEffect(() => {
    if (!authLoading && user) {
      router.push("/challenge");
    }
  }, [user, authLoading, router]);

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-mesh">
          <div className="text-white">Loading...</div>
        </div>
      </Layout>
    );
  }

  // Don't render if user is already authenticated
  if (user) {
    return null;
  }

  const handleSocialSignIn = async (provider: 'google' | 'tiktok' | 'twitter') => {
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await authClient.signIn.social({
        provider,
      });

      if (error) {
        setError(error.message || `Failed to sign in with ${provider}`);
      } else {
        router.push("/challenge");
      }
    } catch (err) {
      setError(`An unexpected error occurred with ${provider} sign in`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setError(error.message || "Invalid email or password");
      } else {
        router.push("/challenge");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-6 bg-mesh pt-30">
        {/* Background Decoration */}
        <div className="fixed inset-0 pointer-events-none z-0 particle-bg"></div>
        <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-[480px]">
          <div className="bg-surface-dark/40 backdrop-blur-xl border border-border-dark p-8 md:p-12 rounded-xl shadow-2xl">
            {/* Headline */}
            <div className="mb-8">
              <h1 className="text-white tracking-tight text-[32px] font-bold leading-tight text-center pb-2">
                Secure Access Login
              </h1>
              <p className="text-white/50 text-center text-sm">
                Enter the arena of premium AI engineering
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <p className="text-white/80 text-sm font-medium leading-normal">
                  Email Address
                </p>
                <input
                  className="form-input w-full rounded-lg text-white focus:outline-0 focus:ring-1 focus:ring-primary border border-white/10 bg-white/5 focus:border-primary h-14 placeholder:text-white/20 p-4 text-base font-normal transition-all"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
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
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
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
                className="w-full bg-primary text-background-dark font-bold py-4 rounded-lg hover:bg-primary/90 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(244,175,37,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                type="submit"
                disabled={isLoading}
              >
                <span>{isLoading ? "Signing In..." : "Sign In"}</span>
                <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                  login
                </span>
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                Don't have an account?{" "}
                <Link
                  className="text-primary font-semibold hover:underline transition-colors"
                  href="/register"
                >
                  Register
                </Link>
              </p>
            </div>

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
              <button 
                className="flex flex-col items-center justify-center gap-2 h-20 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                onClick={() => handleSocialSignIn('google')}
                disabled={isLoading}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-[10px] text-white/60 uppercase font-bold tracking-tighter">
                  Google
                </span>
              </button>

              {/* TikTok */}
              <button 
                className="flex flex-col items-center justify-center gap-2 h-20 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                onClick={() => handleSocialSignIn('tiktok')}
                disabled={isLoading}
              >
                <TikTokLogo className="w-6 h-6" />
                <span className="text-[10px] text-white/60 uppercase font-bold tracking-tighter">
                  TikTok
                </span>
              </button>

              {/* X / Twitter */}
              <button 
                className="flex flex-col items-center justify-center gap-2 h-20 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                onClick={() => handleSocialSignIn('twitter')}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 text-white/70 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z"></path>
                </svg>
                <span className="text-[10px] text-white/60 uppercase font-bold tracking-tighter">
                  Twitter (X)
                </span>
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
