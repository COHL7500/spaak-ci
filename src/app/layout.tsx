import type { Metadata } from "next";
import localFont from "next/font/local";
import "./styles/globals.css";
import { Inter } from "next/font/google";
import React from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ['200', '800'],
})

export const metadata: Metadata = {
  title: "Spaak CI App",
  authors: [{name: "Bastjan R. Sejberg"}],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        {children}
      </body>
    </html>
  );
}
