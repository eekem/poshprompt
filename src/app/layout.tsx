import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PoshPrompt | The Premier AI Arena",
  description: "The world's first competitive arena for prompt engineers. Battle in real-time challenges, level up your rank, and claim loot.",
  icons: {
    icon: '/icon.svg',
  },
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
