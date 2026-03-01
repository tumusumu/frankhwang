import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-noto-sc",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Frank Hwang",
    template: "%s | Frank Hwang",
  },
  description: "Thoughts on software, technology, and life.",
  metadataBase: new URL("https://frankhwang.com"),
  alternates: {
    types: {
      "application/rss+xml": [
        { url: "/rss.xml?lang=en", title: "Frank Hwang's Blog (English)" },
        { url: "/rss.xml?lang=zh", title: "Frank Hwang 的博客（中文）" },
      ],
    },
  },
  openGraph: {
    type: "website",
    siteName: "Frank Hwang",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoSansSC.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
