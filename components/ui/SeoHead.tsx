import { NextSeo } from "next-seo";

export interface SeoData {
  title?: string;
  description?: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
    siteName?: string;
  };
  twitter?: {
    handle?: string;
    tittle?: string;
    description?: string;
    site?: string;

    schema?: string;
    cardType?: "summary" | "summary_large_image";
  };
  additionalMetaTags?: Array<
    | {
        name: string;
        content: string;
      }
    | {
        property: string;
        content: string;
      }
  >;
  keywords?: string;
}

interface SeoHeadProps {
  seo?: SeoData;
  defaultSeo?: SeoData;
}

const defaultSeoConfig: SeoData = {
  title:
    "RecipeHub - Discover Easy Recipes, Meal Plans, Cooking Tips & Global Cuisines",
  description:
    "RecipeHub is your smart cooking companion—find thousands of easy recipes, meal plans, step-by-step guides, nutrition info, and personalized food recommendations for every home cook.",
  canonical: "https://recipehub-five.vercel.app",
  keywords:
    "recipes, easy recipes, cooking tips, meal planning, healthy recipes, quick meals, global cuisines, recipe finder, vegetarian recipes, cooking app, food blog, meal prep",

  openGraph: {
    title: "RecipeHub - Your Smart Recipe & Cooking Companion",
    description:
      "Explore thousands of easy, delicious recipes, personalized meal plans, cooking tips, and global cuisines—perfect for beginners or expert home chefs.",
    siteName: "RecipeHub",
    images: [
      {
        url: "https://www.recipehub.com/og-default.png",
        width: 1200,
        height: 630,
        alt: "RecipeHub - Discover Easy Recipes",
      },
    ],
  },
};

export default function SeoHead({ seo, defaultSeo }: SeoHeadProps) {
  const finalSeo = {
    ...defaultSeoConfig,
    ...defaultSeo,
    ...seo,
  };

  const openGraph = {
    ...defaultSeoConfig.openGraph,
    ...defaultSeo?.openGraph,
    ...seo?.openGraph,
  };

  return (
    <NextSeo
      title={finalSeo.title}
      description={finalSeo.description}
      canonical={finalSeo.canonical}
      openGraph={openGraph}
      twitter={finalSeo.twitter}
      additionalMetaTags={finalSeo.additionalMetaTags}
      additionalLinkTags={[
        {
          rel: "icon",
          href: "/favicon.ico",
        },
        {
          rel: "apple-touch-icon",
          href: "/apple-touch-icon.png",
          sizes: "76x76",
        },
      ]}
    />
  );
}
