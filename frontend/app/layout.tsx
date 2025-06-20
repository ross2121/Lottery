import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Solana Lottery | Win Big with Crypto",
  description: "Participate in the most exciting Solana-based lottery. Buy tickets with SOL and win amazing prizes!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-900/50 via-purple-900/30 to-slate-900/50 backdrop-blur-sm">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
