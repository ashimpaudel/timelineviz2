import type { Metadata } from "next";
import {
  Noto_Serif_Devanagari,
  Playfair_Display,
  Inter,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const notoSerifDevanagari = Noto_Serif_Devanagari({
  variable: "--font-serif-np",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif-en",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "भदौ २३ को समयरेखा — Timeline of Bhadra 23",
  description:
    "जेनजी आन्दोलनका क्रममा भदौ २३ गते संसद भवनअगाडि भएको घटनाक्रमको मिनेट-बाइ-मिनेट समयरेखा। A minute-by-minute reconstruction of the Gen Z protest on Bhadra 23.",
  openGraph: {
    title: "भदौ २३ को समयरेखा — Timeline of Bhadra 23",
    description:
      "A scrollytelling reconstruction of the events of Bhadra 23, 2081.",
    type: "article",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ne"
      className={`
        ${notoSerifDevanagari.variable}
        ${playfairDisplay.variable}
        ${inter.variable}
        ${jetbrainsMono.variable}
        h-full antialiased
      `}
    >
      <body className="min-h-full bg-zinc-50 font-sans text-zinc-900">
        {children}
      </body>
    </html>
  );
}
