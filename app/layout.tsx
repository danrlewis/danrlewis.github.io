import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/nav";
import { Colophon } from "@/components/colophon";

const sans = Geist({
  variable: "--font-sans-family",
  subsets: ["latin"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono-family",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Daniel Lewis — Design Engineer",
  description:
    "Design engineer. Lead Experience Designer at Airbnb. Two decades shaping product, brand, and front-end work. Available for select freelance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          value={{ light: "day", dark: "night" }}
        >
          <Nav />
          <main className="flex-1 flex flex-col">{children}</main>
          <Colophon />
        </ThemeProvider>
      </body>
    </html>
  );
}
