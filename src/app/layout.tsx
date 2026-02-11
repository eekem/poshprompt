import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PoshPrompt | The Premier AI Arena",
  description: "The world's first competitive arena for prompt engineers. Battle in real-time challenges, level up your rank, and claim loot.",
  keywords: ["prompt engineering", "AI arena", "competitive programming", "AI challenges", "prompt battles", "AI gaming"],
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
    title: "PoshPrompt | The Premier AI Arena",
    description: "The world's first competitive arena for prompt engineers. Battle in real-time challenges, level up your rank, and claim loot.",
    url: '/',
    siteName: 'PoshPrompt',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PoshPrompt - AI Arena',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PoshPrompt | The Premier AI Arena',
    description: 'The world\'s first competitive arena for prompt engineers. Battle in real-time challenges, level up your rank, and claim loot.',
    images: ['/og-image.jpg'],
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
    icon: '/icon.svg',
    apple: '/apple-touch-icon.png',
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
