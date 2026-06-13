import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import {
  readData,
  writeData,
} from "@/lib/filehandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {

  const settings =
    readData(
      "settings.json"
    );

  return {

    title:
      settings.metaTitle ||

      settings.websiteTitle ||

      "Lotas",

    description:
      settings.metaDescription ||

      "",

    icons: {
      icon: [
        {
          url: settings.favicon,
        },
      ],
    },

    openGraph: {

      title:
        settings.metaTitle ||

        settings.websiteTitle ||

        "Lotas",

      description:
        settings.metaDescription ||

        "",

      url:
        process.env
          .NEXT_PUBLIC_SITE_URL,

      siteName:
        settings.companyName ||

        "Lotas",

      images: [

        {
          url:
            `${process.env.NEXT_PUBLIC_SITE_URL}${settings["OGImage"]}`,

          width: 1200,

          height: 400,

          alt:
            settings.companyName ||
            "Lotas",
        },

      ],



      locale:
        "en_US",

      type:
        "website",

    },

    twitter: {

      card:
        "summary_large_image",

      title:
        settings.metaTitle ||

        settings.websiteTitle ||

        "Lotas",

      description:
        settings.metaDescription ||

        "",

      images: [
        `${process.env.NEXT_PUBLIC_SITE_URL}${settings["OG Image"]}`,
      ],

    },

  };

}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
