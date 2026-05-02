import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeToggle from "../components/home/header/ThemeToggle";
import { ThemeProvider } from "../components/ThemeProvider/ThemeProvider";
import Providers from "./providers";

export const metadata: Metadata = {
  title: {
    default: "HUD — Intelligent Personal Feed",
    template: "%s | HUD",
  },
  description: "Real-time feeds tailored to your focus. Aggregate Reddit, Hacker News, Dev.to and more — ranked by what matters to you.",
  keywords: ["feed reader", "RSS", "HackerNews", "Reddit", "personal dashboard", "news aggregator"],
  authors: [{ name: "Rakibul Hasan", url: "https://portfolio-rakibul.netlify.app" }],
  openGraph: {
    title: "HUD — Intelligent Personal Feed",
    description: "Real-time feeds tailored to your focus.",
    url: "https://hud.rakibulhasandev.com",
    siteName: "HUD",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "HUD — Intelligent Personal Feed",
    description: "Real-time feeds tailored to your focus.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <ThemeProvider>
            {children}
            <div className="absolute top-3 right-6 z-50">
              <ThemeToggle />
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
