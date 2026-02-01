"use client";

import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/PasswordInput";
import { useState } from "react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("PoshAI_2024!");
  const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-6 bg-mesh pt-30">
        <div className="w-full max-w-[480px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Reset Password Card */}
          <div className="bg-surface-dark/40 backdrop-blur-xl border border-border-dark p-8 md:p-12 rounded-xl shadow-2xl">
            {/* Icon Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-primary text-3xl">
                  lock_reset
                </span>
              </div>
              <h1 className="text-gray-200 text-3xl font-bold text-center tracking-tight">
                Create New Password
              </h1>
              <p className="text-gray-400 text-base font-normal text-center mt-3">
                Your new password must be different from previous used passwords.
              </p>
            </div>

            {/* Form Section */}
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* New Password Field */}
              <PasswordInput
                id="new-password"
                label="New Password"
                value={newPassword}
                onChange={setNewPassword}
                showStrength={true}
                required={true}
              />

              {/* Confirm Password Field */}
              <PasswordInput
                id="confirm-password"
                label="Confirm New Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                required={true}
              />

              {/* Requirement List */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span className="text-gray-300">At least 8 characters</span>
                </div>
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span className="text-gray-300">One uppercase letter</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <span className="material-symbols-outlined text-[14px]">radio_button_unchecked</span>
                  <span className="text-gray-400">One special character</span>
                </div>
                <div className="flex items-center gap-1.5 text-primary">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span className="text-gray-300">One number</span>
                </div>
              </div>

              {/* Primary Action */}
              <div className="pt-2">
                <button className="w-full h-14 bg-primary hover:bg-primary/90 text-background-dark text-base font-bold rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 group" type="submit">
                  <span>Update Password</span>
                  <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
              </div>
            </form>

            {/* Footer Navigation */}
            <div className="mt-10 pt-8 border-t border-border-dark/50 text-center">
              <button
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
                onClick={() => router.push('/login')}
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back to Sign In
              </button>
            </div>
          </div>

          {/* Trust Badges / Social Microcopy */}
          <div className="text-center space-y-4 opacity-60">
            <p className="text-gray-400 text-xs uppercase tracking-[0.2em] font-bold">
              Secure Password Reset
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
