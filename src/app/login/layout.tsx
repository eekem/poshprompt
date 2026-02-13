import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Login",
  description: "Sign in to your PoshPrompt account to access AI training challenges.",
  path: "/login",
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
