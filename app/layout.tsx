import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import "./globals.css";
import Footer from "@/components/layout/footer";
import ScrollUtilities from "@/components/scroll-utilities";
import { Header } from "@/components/layout/Header";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Bus2Ride – Party Bus & Limo Service",
  description:
    "Nationwide party bus and limo booking with real humans and smart tools.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.className} antialiased`}
        suppressHydrationWarning={true} // to avoid hydration mismatch warnings
      >
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />

          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

          <ScrollUtilities />
          <Footer />
        </NextThemeProvider>
      </body>
    </html>
  );
}
