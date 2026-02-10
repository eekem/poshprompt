import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Challenge Arena - PoshPrompt',
  description: 'Take on AI challenges and test your prompt engineering skills',
};

export default function ChallengeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
