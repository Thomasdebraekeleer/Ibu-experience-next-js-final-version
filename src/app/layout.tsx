import type { Metadata } from "next";
import { metadataBase } from "@/config/site";

export const metadata: Metadata = {
  metadataBase,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
