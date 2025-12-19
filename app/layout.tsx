import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import Navigation from "@/components/layout/navigation";
import "./globals.css";
import Footer from "@/components/layout/footer";
import ScrollUtilities from "@/components/scroll-utilities";
import { rootMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...rootMetadata({
    defaultTitle: "Bus2Ride",
    description:
      "Premium party buses, limos, and coach buses — clean rides, pro drivers, and fast quotes.",
  }),
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
          <Navigation />

          <main>{children}</main>

          <ScrollUtilities />
          <Footer />
        </NextThemeProvider>
      </body>
    </html>
  );
}
