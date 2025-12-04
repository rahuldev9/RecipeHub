import type { Metadata, Viewport } from "next";
import { Inter, Josefin_Sans } from "next/font/google";
import "./globals.css";
// import "../utils/promise-polyfill";
// import { Providers } from "./providers";
// import { ThemeProvider } from "next-themes";

// import FloatingChatbot from "./components/ClientOnlyFloatingChatbot";
import { headers } from "next/headers";
import { seoConfig } from "../lib/seo-config";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "RecipeHub",
  url: "https://recipehub-five.vercel.app",
  description:
    "RecipeHub is your smart cooking companion—find thousands of easy recipes, meal plans, step-by-step guides, nutrition info, and personalized food recommendations for every home cook.",
};

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });
const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-josefin-sans",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// --------------------------------------------------------------
// ⭐ Dynamic Metadata - Read pathname from middleware header
// --------------------------------------------------------------
export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "/";

  const key = resolveSeoKey(pathname);
  const data = seoConfig[key];

  if (!data) {
    return {
      title: "RecipeHub",
      description: "Recipehub",
    };
  }

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    alternates: {
      canonical: data.canonical,
    },
    openGraph: {
      ...data.openGraph,
      url: data.canonical,
    },
    // twitter: {
    //   card: data.twitter.cardType,
    //   title: data.twitter.tittle,
    //   description: data.twitter.description,
    // },
  };
}

// --------------------------------------------------------------
// ⭐ Route → SEO key resolver
// --------------------------------------------------------------
function resolveSeoKey(pathname: string): string {
  if (pathname === "/") return "home";
  if (pathname === "/about-us") return "aboutUs";

  return "home";
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={josefinSans.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&family=Momo+Signature&display=swap"
          rel="stylesheet"
        />

        <meta
          name="google-site-verification"
          content="tpjN6Z0-EFrqmEq_Bc4_a8AoBzk1PpVCDQxe4Pp7rlY"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>

      <body className={inter.className}>{children}</body>
    </html>
  );
}
