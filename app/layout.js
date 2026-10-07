import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Devmate | Client Inquiry Portal",
    template: "%s | Devmate Solutions",
  },
  description:
    "Secure client inquiry and mortgage consultation portal powered by Devmate Solutions. Connecting premium real estate partners with AI-powered workflow automation.",
  keywords: [
    "Devmate Solutions",
    "Client Inquiry Portal",
    "Mortgage Consultation",
    "Real Estate Inquiry",
    "Elysian Real Estate",
    "Pearlshire Developers",
    "Forex Demo",
    "Vizz Real Estate",
    "AI Movement",
  ],
  authors: [{ name: "Devmate Solutions", url: "https://devmatesolutions.com" }],
  creator: "Devmate Solutions",
  publisher: "Devmate Solutions",
  metadataBase: new URL("https://devmatesolutions.com"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "256x256" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "256x256", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Devmate | Client Inquiry Portal",
    description:
      "Secure client inquiry and mortgage consultation portal powered by Devmate Solutions.",
    url: "https://devmatesolutions.com",
    siteName: "Devmate Client Inquiry Portal",
    images: [
      {
        url: "/devmate-logo.png",
        width: 256,
        height: 256,
        alt: "Devmate Solutions Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Devmate | Client Inquiry Portal",
    description:
      "Secure client inquiry and mortgage consultation portal powered by Devmate Solutions.",
    images: ["/devmate-logo.png"],
    creator: "@devmatesolutions",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export const viewport = {
  themeColor: "#c0262b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
