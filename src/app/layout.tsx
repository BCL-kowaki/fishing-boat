import type { Metadata } from "next";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | 鹿児島 東串良 波見港 泳がせ・ジギング`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "遊漁船", "ヤマト", "大和", "鹿児島", "東串良", "波見港",
    "泳がせ", "ジギング", "カンパチ", "種子島", "内之浦", "釣り船",
  ],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [{ url: "/images/og/default.jpg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-white">
        {children}
      </body>
    </html>
  );
}
