import type { Metadata } from "next";

import "@/app/globals.css";

import { getBaseUrl } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "EVUNO",
    template: "%s | EVUNO"
  },
  description: "Official EVUNO storefront for custom-engineered athleisure and future identity.",
  applicationName: "EVUNO",
  icons: {
    icon: "/assets/logos/evuno-mark-white-on-black.png"
  },
  openGraph: {
    title: "EVUNO",
    description: "Custom-engineered athleisure built for motion, restraint, and evolution.",
    url: getBaseUrl(),
    siteName: "EVUNO",
    type: "website",
    images: [
      {
        url: "/assets/logos/evuno-wordmark-metallic.png",
        alt: "EVUNO metallic wordmark"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "EVUNO",
    description: "Custom-engineered athleisure built for motion, restraint, and evolution.",
    images: ["/assets/logos/evuno-wordmark-metallic.png"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-abyss text-mist antialiased">
        {children}
      </body>
    </html>
  );
}
