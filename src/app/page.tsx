import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata();

export default function Home() {
  return <HomeClient />;
}
