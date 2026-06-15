import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Francis Farms | Fresh Local Produce Delivered in St. Thomas, USVI",
  description: "Farm-fresh produce grown right here on St. Thomas. Free-range eggs, local fruits, organic vegetables delivered same-day. No pesticides, no wax. Order online now!",
  keywords: ["St. Thomas farm", "USVI produce", "fresh eggs", "local vegetables", "farm delivery", "organic produce", "Virgin Islands"],
  openGraph: {
    title: "Francis Farms - Fresh Local Produce in St. Thomas",
    description: "Farm-fresh produce delivered same-day across St. Thomas. Locally grown, pesticide-free, family-owned.",
    type: "website",
  },
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