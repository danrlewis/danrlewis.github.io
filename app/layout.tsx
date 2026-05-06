import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Nav } from "@/components/nav";
import { Colophon } from "@/components/colophon";
import { MoodToggle } from "@/components/mood-toggle";

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
          {/* Fixed mood toggle — bottom-right, aligns with the rail gutter
              so it sits neatly inside the colophon when fully scrolled.
              mix-blend-difference is set HERE on the wrapper (not on the
              inner button) because the wrapper is the element that lives in
              the <body> stacking context. Putting the blend on the wrapper
              lets the toggle's white visuals blend against everything the
              body painted before it — the actual page content. If the blend
              were on the button instead, the wrapper's z-index stacking
              context would isolate it and the blend would have nothing to
              blend with, which is exactly the bug we hit. */}
          <div
            data-mood-toggle
            className="fixed bottom-6 right-[var(--rail)] z-60 md:bottom-8 mix-blend-difference"
          >
            <MoodToggle hideLabel />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
