"use client";

import { Suspense } from "react";
import Layout from "@/components/Layout";
import ResetPasswordContent from "./ResetPasswordContent";

export default function ResetPasswordPage() {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </Layout>
  );
}
