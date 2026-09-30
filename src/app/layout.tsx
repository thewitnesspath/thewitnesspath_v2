import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Witness Path",
  description:
    "Witness His grace. Strengthen your faith.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}