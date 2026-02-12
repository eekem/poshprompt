"use client";

import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/lib/use-auth";

export default function SecurePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [message, setMessage] = useState("Securing your account...");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
        return;
      }

      // Process the secure check
      processSecureCheck();
    }
  }, [user, authLoading, router]);

  const processSecureCheck = async () => {
    try {
      setMessage("Analyzing your device fingerprint...");
      
      // Collect fingerprint data
      const fingerprintData = {
        userAgent: navigator.userAgent,
        device: navigator.platform,
        browser: getBrowserInfo(),
        os: getOSInfo(),
        screen: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
      };

      setMessage("Validating your account...");
      
      const response = await fetch('/api/secure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fingerprintData
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.success) {
          setMessage("Account secured! Redirecting...");
          
          // Redirect to challenge page after successful processing
          setTimeout(() => {
            router.push("/challenge");
          }, 1500);
        } else if (data.banned) {
          setError("Account flagged for suspicious activity. You have been logged out.");
          setTimeout(() => {
            router.push("/login");
          }, 3000);
        }
      } else {
        setError(data.error || "Security check failed");
        setTimeout(() => {
          router.push("/challenge");
        }, 3000);
      }
    } catch (err) {
      console.error('Secure check error:', err);
      setError("Security check failed. Continuing anyway...");
      setTimeout(() => {
        router.push("/challenge");
      }, 2000);
    } finally {
      setIsProcessing(false);
    }
  };

  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  const getOSInfo = () => {
    const ua = navigator.userAgent;
    if (ua.includes('Windows')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Unknown';
  };

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

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-6 bg-mesh pt-30">
        {/* Background Decoration */}
        <div className="fixed inset-0 pointer-events-none z-0 particle-bg"></div>
        <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 w-full max-w-[480px]">
          <div className="bg-surface-dark/40 backdrop-blur-xl border border-border-dark p-8 md:p-12 rounded-xl shadow-2xl text-center">
            {/* Security Icon */}
            <div className="mb-6 flex justify-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                error ? 'bg-red-500/20' : isProcessing ? 'bg-primary/20' : 'bg-green-500/20'
              }`}>
                <span className={`material-symbols-outlined text-2xl ${
                  error ? 'text-red-400' : isProcessing ? 'text-primary animate-pulse' : 'text-green-400'
                }`}>
                  {error ? 'error' : isProcessing ? 'security' : 'verified_user'}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-white text-2xl font-bold mb-4">
              Security Check
            </h1>

            {/* Message */}
            <div className="mb-6">
              {error ? (
                <p className="text-red-400 text-sm">{error}</p>
              ) : (
                <p className="text-[#bab09c] text-sm">{message}</p>
              )}
            </div>

            {/* Processing Indicator */}
            {isProcessing && !error && (
              <div className="flex justify-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            )}

            {/* Success State */}
            {!isProcessing && !error && (
              <div className="flex justify-center">
                <span className="text-green-400 text-sm">✓ All checks passed</span>
              </div>
            )}
          </div>

          {/* Security Features Footer */}
          <div className="mt-8 flex justify-center gap-8 text-white/20 text-[10px] uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[12px]">fingerprint</span>
              <span>Device Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[12px]">shield_lock</span>
              <span>256-Bit Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[12px]">verified_user</span>
              <span>Account Protected</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
