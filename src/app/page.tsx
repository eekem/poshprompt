import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "PoshPrompt | Home - The Premier AI Arena",
  description: "Join the world's first competitive arena for prompt engineers. Test your skills in real-time AI challenges, climb the rankings, and earn rewards.",
  keywords: ["prompt engineering", "AI challenges", "competitive programming", "AI arena", "prompt battles"],
  openGraph: {
    title: "PoshPrompt | Home - The Premier AI Arena",
    description: "Join the world's first competitive arena for prompt engineers. Test your skills in real-time AI challenges, climb the rankings, and earn rewards.",
    url: '/',
    type: 'website',
  },
  twitter: {
    title: "PoshPrompt | Home - The Premier AI Arena",
    description: "Join the world's first competitive arena for prompt engineers. Test your skills in real-time AI challenges, climb the rankings, and earn rewards.",
  },
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return <HomeClient />;
}
