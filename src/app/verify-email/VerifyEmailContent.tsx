"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { authClient } from "@/app/lib/auth-client";

interface ExpiryData {
  expired: boolean;
  remainingTime: number;
  expiresAt: string;
}

export default function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [expiryData, setExpiryData] = useState<ExpiryData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [checkingExpiry, setCheckingExpiry] = useState(false);

  const checkTokenExpiry = async () => {
    if (!email) return;
    
    setCheckingExpiry(true);
    try {
      const response = await fetch(`/api/check-verification-expiry?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (response.ok) {
        setExpiryData(data);
        setTimeRemaining(data.remainingTime);
      } else {
        console.error('Error checking expiry:', data.error);
      }
    } catch (error) {
      console.error('Error checking token expiry:', error);
    } finally {
      setCheckingExpiry(false);
    }
  };

  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    if (emailFromUrl) {
      try {
        // Decode base64 email
        const decodedEmail = atob(emailFromUrl);
        setEmail(decodedEmail);
      } catch (error) {
        console.error("Failed to decode email:", error);
        // Fallback to empty string if decoding fails
        setEmail("");
      }
    }
  }, [searchParams]);

  // Check token expiry when email is set
  useEffect(() => {
    if (email) {
      checkTokenExpiry();
    }
  }, [email]);

  // Countdown timer
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // When timer reaches 0, update expiry data
            setExpiryData((prevData) => 
              prevData ? { ...prevData, expired: true, remainingTime: 0 } : null
            );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    setError("");
    setSuccess(false);

    try {
      const { data, error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });

      if (error) {
        setError(error.message || "Failed to resend verification email");
      } else {
        setSuccess(true);
        // Check expiry again after resending
        setTimeout(() => {
          checkTokenExpiry();
        }, 1000);
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
                  {email || "No email provided"}
                </p>
                <p className="text-gray-400 text-sm font-normal">
                  {checkingExpiry ? "Checking..." : expiryData?.expired ? "Token expired" : "Pending verification..."}
                </p>
              </div>
              <div className="size-10 flex items-center justify-center bg-primary/20 rounded-lg text-primary">
                <span className="material-symbols-outlined text-xl">mark_email_unread</span>
              </div>
            </div>
            
            {/* Countdown Timer */}
            {timeRemaining > 0 && (
              <div className="mt-4 p-4 bg-surface-dark border border-border-dark rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">timer</span>
                    <span className="text-gray-300 text-sm font-medium">Token expires in:</span>
                  </div>
                  <span className="text-primary font-mono font-bold text-lg">
                    {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            )}
            
            {/* Expired Token Message */}
            {expiryData?.expired && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-400">error</span>
                  <div>
                    <p className="text-red-400 text-sm font-medium">Verification token has expired</p>
                    <p className="text-red-400/70 text-xs mt-1">Please request a new verification email below</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button 
            className="w-full h-14 bg-primary hover:bg-primary/90 text-background-dark text-base font-bold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleResendEmail}
            disabled={isResending || !email || (!expiryData?.expired && timeRemaining > 0)}
          >
            <span className="material-symbols-outlined">{isResending ? "refresh" : "refresh"}</span>
            {isResending ? "Sending..." : expiryData?.expired ? "Send New Verification Email" : "Resend Verification Email"}
          </button>
          
          {/* Timer Info */}
          {!expiryData?.expired && timeRemaining > 0 && (
            <p className="text-gray-400 text-xs text-center mb-6">
              You can request a new verification email in {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
            </p>
          )}

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
