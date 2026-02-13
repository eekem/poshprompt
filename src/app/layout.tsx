import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PoshPrompt - Engineer smarter prompts. Build unstoppable mini-models.",
  description: "PoshPrompt is a strategic AI builder game where you stack tools, apply operators, and craft the strongest AI mini-model to dominate challenges.",
  keywords: ["prompt engineering", "AI arena", "competitive programming", "AI challenges", "prompt battles", "AI gaming", "mini-models", "AI builder game"],
  authors: [{ name: "PoshPrompt Team" }],
  creator: "PoshPrompt",
  publisher: "PoshPrompt",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.SITE_URL || 'https://poshprompt.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "PoshPrompt - Engineer smarter prompts. Build unstoppable mini-models.",
    description: "PoshPrompt is a strategic AI builder game where you stack tools, apply operators, and craft the strongest AI mini-model to dominate challenges.",
    url: '/',
    siteName: 'PoshPrompt',
    images: [
      {
        url: 'https://poshprompt.com/seo.png',
        width: 1200,
        height: 630,
        alt: 'PoshPrompt - Engineer smarter prompts. Build unstoppable mini-models.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PoshPrompt - Engineer smarter prompts. Build unstoppable mini-models.',
    description: 'PoshPrompt is a strategic AI builder game where you stack tools, apply operators, and craft the strongest AI mini-model to dominate challenges.',
    images: ['https://poshprompt.com/seo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
