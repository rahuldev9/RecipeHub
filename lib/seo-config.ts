import { SeoData } from "../components/ui/SeoHead";

export const seoConfig: Record<string, SeoData> = {
  // HOME PAGE
  home: {
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
  },

  // ABOUT US
  aboutUs: {
    title: "About RecipeHub - Your Partner in Cooking & Delicious Living",
    description:
      "Learn about RecipeHub—the platform created to simplify cooking with curated recipes, smart meal planning, and tools designed to inspire home chefs worldwide.",
    canonical: "https://recipehub-five.vercel.app/about-us",
    keywords:
      "about recipehub, cooking platform, recipe creators, food discovery team, meal planning tools, cooking innovation, recipe community",
    openGraph: {
      title: "About RecipeHub - Who We Are & Why We Love Food",
      description:
        "Meet the team behind RecipeHub—on a mission to help millions cook better with smart tools, curated recipes, and food inspiration.",
      siteName: "RecipeHub",
    },
  },
};
