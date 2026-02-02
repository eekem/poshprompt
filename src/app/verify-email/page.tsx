"use client";

import { Suspense } from "react";
import Layout from "@/components/Layout";
import VerifyEmailContent from "./VerifyEmailContent";

export default function VerifyEmailPage() {
  return (
    <Layout>
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </Layout>
  );
}
