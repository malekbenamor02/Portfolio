import { Inter, Playfair_Display } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PageWrapper } from "@/components/layout/page-wrapper";
import { NavigationEvents } from "@/components/navigation-events";
import { ThemeProvider } from "next-themes";
import { ClientLayout } from "./client-layout";
import { generateMetadata } from "./metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { CustomCursor } from "@/components/common/enhanced-cursor";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata = generateMetadata();

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/images/favicon.png" sizes="any" />
        <link rel="icon" href="/images/favicon.png" type="image/png" />
        <link rel="shortcut icon" href="/images/favicon.png" />
        <JsonLd />
      </head>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen bg-background`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ClientLayout>
            <CustomCursor />
            <Suspense fallback={null}>
              <NavigationEvents />
            </Suspense>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <PageWrapper>
                <main className="flex-1">{children}</main>
              </PageWrapper>
              <Footer />
            </div>
          </ClientLayout>
          <Analytics />
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}