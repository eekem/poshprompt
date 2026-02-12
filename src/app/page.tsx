import { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "PoshPrompt | Strategic AI Building Game",
  description: "Build AI models using limited tools and compete based on how intelligently you combine them. A competitive strategy game of resource management and AI construction.",
  keywords: ["AI building game", "strategy game", "AI competition", "model construction", "resource management", "AI meta-layer"],
  openGraph: {
    title: "PoshPrompt | Strategic AI Building Game",
    description: "Build AI models using limited tools and compete based on how intelligently you combine them. A competitive strategy game of resource management and AI construction.",
    url: '/',
    type: 'website',
  },
  twitter: {
    title: "PoshPrompt | Strategic AI Building Game",
    description: "Build AI models using limited tools and compete based on how intelligently you combine them. A competitive strategy game of resource management and AI construction.",
  },
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return <HomeClient />;
}
