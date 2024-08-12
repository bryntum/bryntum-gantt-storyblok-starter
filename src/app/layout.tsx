import type { Metadata } from "next";
import "./globals.css";
import StoryblokProvider from "@/components/StoryblokProvider";
import StoryDataProvider from "@/contexts/StoryData.context";

export const metadata: Metadata = {
  title: "Getting started with Bryntum Gantt in Next.js",
  description: "Quick Start Guide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StoryblokProvider>
      <StoryDataProvider>
        <html lang="en">
          <body>{children}</body>
        </html>
      </StoryDataProvider>
    </StoryblokProvider>
  );
}
