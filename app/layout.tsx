import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import Navigation from "@/components/layout/navigation";
import "./globals.css";
import Footer from "@/components/layout/footer";
import ScrollUtilities from "@/components/scroll-utilities";
import { rootMetadata } from "@/lib/seo/metadata";
import { LiveChatWidget } from "@/components/LiveChatWidget";

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
      <head>
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-90TGBE5355"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-90TGBE5355');`,
          }}
        />
      </head>
      <body
        className={`${geistSans.className} antialiased`}
        suppressHydrationWarning={true} // to avoid hydration mismatch warnings
      >
        <NextThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />

          <main>{children}</main>

          <ScrollUtilities />
          <LiveChatWidget />
          <Footer />
        </NextThemeProvider>
      </body>
    </html>
  );
}
