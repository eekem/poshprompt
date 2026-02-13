import type { Metadata } from "next";

const baseUrl = process.env.SITE_URL || "https://poshprompt.com";

type SEOProps = {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  keywords?: string[];
};

export function createMetadata({
  title,
  description,
  image = "/seo.jpg",
  path = "/",
  keywords = [],
}: SEOProps = {}): Metadata {
  const fullTitle = title
    ? `${title} | PoshPrompt`
    : "PoshPrompt - Engineer smarter prompts. Build unstoppable mini-models.";

  const fullDescription =
    description ??
    "PoshPrompt is a strategic AI builder game where you stack tools, apply operators, and craft the strongest AI mini-model to dominate challenges.";

  return {
    metadataBase: new URL(baseUrl),

    title: fullTitle,
    description: fullDescription,

    keywords: [
      "prompt engineering",
      "AI arena",
      "AI builder game",
      ...keywords,
    ],

    authors: [{ name: "PoshPrompt Team" }],
    creator: "PoshPrompt",
    publisher: "PoshPrompt",

    alternates: {
      canonical: path,
    },

    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: path,
      siteName: "PoshPrompt",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: "en_US",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      images: [image],
    },

    robots: {
      index: true,
      follow: true,
    },

    icons: {
      icon: "/icon.png",
      apple: "/icon.png",
    },

    manifest: "/site.webmanifest",
  };
}
