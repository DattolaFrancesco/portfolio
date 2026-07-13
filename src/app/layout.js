import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Francesco Dattola",
    template: "%s | Francesco Dattola",
  },
  description:
    "Francesco Dattola — full-stack developer based in Brescia, Italy. Portfolio of web projects, works and case studies.",
  applicationName: "Francesco Dattola",
  authors: [{ name: "Francesco Dattola" }],
  creator: "Francesco Dattola",
  publisher: "Francesco Dattola",
  keywords: [
    "Francesco Dattola",
    "portfolio",
    "full-stack developer",
    "web developer",
    "Brescia",
    "Italy",
  ],
  metadataBase: new URL("https://francescodattola.com"),
  openGraph: {
    title: "Francesco Dattola",
    description:
      "Full-stack developer based in Brescia, Italy. Portfolio of web projects, works and case studies.",
    siteName: "Francesco Dattola",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Francesco Dattola",
    description:
      "Full-stack developer based in Brescia, Italy. Portfolio of web projects, works and case studies.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} min-h-dvh antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}