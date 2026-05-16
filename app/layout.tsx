import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Francis Farms",
  description: "Farm-fresh produce delivered across St. Thomas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}