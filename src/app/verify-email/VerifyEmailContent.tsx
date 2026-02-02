"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { authClient } from "@/app/lib/auth-client";

export default function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    if (emailFromUrl) {
      setEmail(decodeURIComponent(emailFromUrl));
    }
  }, [searchParams]);

  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    setError("");

    try {
      const { data, error } = await authClient.sendVerificationEmail({
        email,
      });

      if (error) {
        setError(error.message || "Failed to resend verification email");
      } else {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-mesh pt-30">
      <div className="w-full max-w-[480px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Verification Card */}
        <div className="bg-surface-dark/40 backdrop-blur-xl border border-border-dark p-8 md:p-12 rounded-xl shadow-2xl text-center">
          {/* Icon Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">
                mail
              </span>
            </div>
            <h1 className="text-gray-200 text-3xl font-bold text-center tracking-tight">
              Verify Your Email
            </h1>
            <p className="text-gray-400 text-base font-normal text-center mt-3">
              We've sent a code to your inbox to secure your{" "}
              <span className="text-primary font-medium">prompt arena</span> access. Please check your email to complete registration.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm">Verification email resent successfully!</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* User Email Card */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-4 rounded-lg bg-surface-dark border border-border-dark p-5">
              <div className="flex flex-col gap-1 items-start text-left">
                <p className="text-gray-200 text-base font-bold leading-tight">
                  {email || "alexander.v@creative-agency.com"}
                </p>
                <p className="text-gray-400 text-sm font-normal">
                  Pending verification...
                </p>
              </div>
              <div className="size-10 flex items-center justify-center bg-primary/20 rounded-lg text-primary">
                <span className="material-symbols-outlined text-xl">mark_email_unread</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            className="w-full h-14 bg-primary hover:bg-primary/90 text-background-dark text-base font-bold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleResendEmail}
            disabled={isResending || !email}
          >
            <span className="material-symbols-outlined">{isResending ? "refresh" : "refresh"}</span>
            {isResending ? "Sending..." : "Resend Verification Email"}
          </button>

          {/* Footer Links */}
          <div className="mt-10 pt-8 border-t border-border-dark/50 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Didn't receive the email? Check your spam folder.
            </p>
            <div className="flex justify-center gap-6">
              <button
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
                onClick={() => router.push('/register')}
              >
                <span className="material-symbols-outlined text-lg">edit</span>
                Change Email
              </button>
              <button
                className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 font-medium transition-colors group"
                onClick={() => router.push('/support')}
              >
                <span className="material-symbols-outlined text-lg">help</span>
                Contact Support
              </button>
            </div>
          </div>
        </div>

        {/* Trust Badges / Social Microcopy */}
        <div className="text-center space-y-4 opacity-60">
          <p className="text-gray-400 text-xs uppercase tracking-[0.2em] font-bold">
            PoshPrompt Secure Arena Integration
          </p>
        </div>
      </div>
    </div>
  );
}
