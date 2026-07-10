import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LuminaX — The Home of On-Chain Investments",
  description:
    "The all-in-one platform for discovering and investing in tokenized assets.",
  openGraph: {
    title: "LuminaX — The Home of On-Chain Investments",
    description: "The all-in-one platform for discovering and investing in tokenized assets.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
