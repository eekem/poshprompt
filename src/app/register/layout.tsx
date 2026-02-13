import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Register",
  description: "Create your PoshPrompt account and start competing in AI training challenges.",
  path: "/register",
});

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
