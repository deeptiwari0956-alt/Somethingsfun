import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "becurious — Learn anything. Your way.",
  description:
    "A personal learning engine that builds an adaptive path around your goals, level, and time.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
