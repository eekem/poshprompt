import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Verify Email",
  description: "Verify your email address to activate your PoshPrompt account.",
  path: "/verify-email",
});

export default function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
