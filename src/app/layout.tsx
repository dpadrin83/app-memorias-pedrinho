import type { Metadata } from "next";
import { Roboto_Flex } from "next/font/google";
import "./globals.css";

const robotoFlex = Roboto_Flex({
  variable: "--font-roboto-flex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portal de Memórias",
  description: "Memórias da família, organizadas com calma.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Memórias",
    statusBarStyle: "default",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${robotoFlex.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
