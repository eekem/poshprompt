"use client";

import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/app/lib/auth-client";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (error) {
        setError(error.message || "Failed to send reset email");
      } else {
        setSuccess(true);
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
        <div className="w-full max-w-[480px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Recovery Card */}
          <div className="bg-surface-dark/40 backdrop-blur-xl border border-border-dark p-8 md:p-12 rounded-xl shadow-2xl">
            {/* Success Message */}
            {success && (
              <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-green-400 text-2xl">
                    check_circle
                  </span>
                </div>
                <h3 className="text-green-400 text-lg font-semibold mb-2">
                  Reset Link Sent!
                </h3>
                <p className="text-green-300/80 text-sm">
                  We've sent a password reset link to your email address.
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-8 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {!success && (
              <>
                {/* Icon Header */}
                <div className="flex flex-col items-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-primary text-3xl">
                      lock_reset
                    </span>
                  </div>
                  <h1 className="text-gray-200 text-3xl font-bold text-center tracking-tight">
                    Lost your way?
                  </h1>
                  <p className="text-gray-400 text-base font-normal text-center mt-3">
                    Enter the email address associated with your PoshPrompt account. We'll send you a secure link to reset your password.
                  </p>
                </div>

                {/* Recovery Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="text-white text-sm font-semibold block ml-1" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors">
                        alternate_email
                      </span>
                      <input
                        className="w-full pl-12 pr-4 h-14 bg-surface-dark border border-border-dark text-white rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-[#bab09c]"
                        id="email"
                        name="email"
                        placeholder="e.g. prompt.engineer@ai.com"
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>

                {/* Footer Navigation */}
                <div className="mt-10 pt-8 border-t border-border-dark/50 text-center">
                  <button
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
                    onClick={() => router.push('/login')}
                  >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Back to Login
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Trust Badges / Social Microcopy */}
          <div className="text-center space-y-4 opacity-60">
            <p className="text-gray-400 text-xs uppercase tracking-[0.2em] font-bold">
              Trusted by 50,000+ Prompt Engineers
            </p>
            <div className="flex justify-center gap-6 grayscale contrast-125 brightness-150">
              <img
                className="h-5 object-contain"
                alt="OpenAI logo placeholder"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1u_8iq-mHM6xsJ1n7-CMW7__bafrKP4EQ3FRNoloQW2I0_nltxWX4B7_RsipHkTGj7nsxOSVprnyRhtsBSasPuYPYGfxHblgLzVT7OtzmI8rQXPmIQ34ZXwUlPguQyKMkOPuvW_BiXZUyFOsnBCSqfd9jieN3QzjzOHZrB3qR6e9Fg1aflridtgp8JhzOdpVmnNSHveE9TnzP3FP9Kev_ii7G7xNW3hYzUKoJf-CvWp22SduupjrALLn2rI4i9vbB0Hk6NZNgm0TQ"
              />
              <img
                className="h-5 object-contain"
                alt="Anthropic logo placeholder"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuVR-hKogMJjZmd9YdfgG4Z08NnePU0eQBD1elI8slFOabnJRfZy4XUHcFxxtPy0gBcyOfuo7yrqL7Q2Dn5u3xfzq5_h2H_x6ysPaiRbcJT9zV7bogQXyhuBw6riTQCnC0Ca8BUYv8pWgWiWMK59pmaXw76S8zbe30DUDGqH5EIvp_PwirK9wEwHjNtXoBT5lEyO9rlR5hDQbc7qIhX91wlAPqKxD2JkxGoHF0Lk93N5BilZtaeMUiTCKNybzrmHZtRACjW1Vix2gO"
              />
              <img
                className="h-5 object-contain"
                alt="Google Cloud logo placeholder"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6AJo6_nxE-8s8Kzqa284wmdrhXWcw92R88KQVvHqUYioeugk4EqLLISBE8wq4Ovc_RPOaXMjQACZErQHy2A5hbD6vHv5dTr3F0a1rnKSkfJAUbtDpE7kdQ38ez1BL6sfA-Q1UAQx7AJn2SrXajq3x-OAsYCIdINJU-xBtj_-pMF3yLYXdfX-PDRF_-a7XwIZPTT-QMg6iossyxh-Veypc5xbbuQ2A9XFOYXCBtQeQTY5KQzzKPMKyR2T80RyUJk-Y6wdEkY77Jadp"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
