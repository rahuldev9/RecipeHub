"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStatus } from "./components/AuthStatus";

export default function Home() {
  const router = useRouter();
  const { loggedIn } = useAuthStatus();

  // const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [input, setInput] = useState("");
  const [recipeList, setRecipeList] = useState<string[]>([]);
  const [showIndex, setShowIndex] = useState(0);
  // useEffect(() => {
  //   const supabase = createClient();

  //   supabase.auth.getUser().then(({ data: { user } }) => {
  //     setLoggedIn(!!user);
  //   });
  // }, []);
  const autoText = "eggs, tomatoes, rice";

  const recipePool = [
    {
      title: "Quick Egg Fried Rice",
      steps: [
        "Scramble eggs",
        "Add cooked rice and soy sauce",
        "Stir for 3 minutes",
      ],
    },
    {
      title: "Tomato Egg Stir-Fry",
      steps: [
        "Cook tomatoes until soft",
        "Add whisked eggs",
        "Stir and season",
      ],
    },
    {
      title: "Simple Veggie Soup",
      steps: [
        "Boil vegetables",
        "Season with salt & pepper",
        "Simmer for 10 minutes",
      ],
    },
    {
      title: "Garlic Rice Bowl",
      steps: ["Fry garlic", "Add rice", "Mix with butter"],
    },
    {
      title: "Tomato Rice Mix",
      steps: ["Cook tomatoes", "Mix with rice", "Add spices"],
    },
  ];

  function startCycle() {
    setInput("");
    setRecipeList([]);
    setShowIndex(0);

    let index = 0;

    const typeInterval = setInterval(() => {
      setInput(autoText.slice(0, index));
      index++;

      if (index > autoText.length) {
        clearInterval(typeInterval);
        setTimeout(() => generateRandomRecipes(), 600);
      }
    }, 120);
  }

  function generateRandomRecipes() {
    const shuffled = [...recipePool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    const formatted = selected.map((r) => formatRecipe(r));

    setRecipeList(formatted);

    selected.forEach((_, i) => {
      setTimeout(() => setShowIndex((prev) => prev + 1), 1000 * (i + 1));
    });

    setTimeout(() => startCycle(), 4500);
  }

  function formatRecipe(recipe: any) {
    return `
🍽️ **${recipe.title}**

${recipe.steps.map((step: string, i: number) => `${i + 1}. ${step}`).join("\n")}
    `;
  }

  useEffect(() => {
    startCycle();
  }, []);

  return (
    <div className="h-full bg-gradient-to-b from-orange-50 to-white text-gray-800 pb-40">
      {/* Navbar */}
      <nav className="flex justify-between items-center max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2">
          <Image
            src="/RecipeHublogo.png"
            alt="RecipeHub Logo"
            width={36}
            height={36}
            className="rounded-md"
          />
          <h1 className="text-2xl font-bold text-orange-600">RecipeHub</h1>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          {loggedIn ? "Dashboard" : " Get Started"}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mt-20 px-6">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
          Discover Recipes Automatically
        </h2>
        <p className="text-gray-600 mt-4 text-lg max-w-2xl">
          Enjoy infinite recipe suggestions with fun typing animations.
        </p>

        {/* Auto Typing Input */}
        <div className="mt-8 w-full max-w-lg relative">
          <input
            type="text"
            value={input}
            readOnly
            className="w-full border border-gray-300 p-4 rounded-xl shadow-sm text-gray-700"
          />
          <span className="absolute right-6 top-4 text-orange-600 font-bold animate-pulse">
            |
          </span>
        </div>
      </section>

      {/* Recipe Cards */}
      <section className="mt-16 px-6 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl justify-items-center">
          {recipeList.slice(0, showIndex).map((recipe, i) => (
            <div
              key={i}
              className="w-full md:w-80 bg-white border border-orange-100 shadow p-6 rounded-xl whitespace-pre-wrap text-left opacity-0 animate-fadeIn"
            >
              {recipe}
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="mt-32 px-6 flex justify-center">
        <div className="max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-orange-600">
            What is RecipeHub?
          </h2>
          <p className="mt-4 text-gray-600 text-lg leading-relaxed">
            RecipeHub is your intelligent cooking companion — it takes your
            ingredients, your preferences, and generates fresh recipe ideas
            instantly. With endless automated suggestions and a fun, animated
            UI, RecipeHub makes cooking simpler, faster, and more creative.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-24 px-6 flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl">
          <div className="p-6 bg-white shadow rounded-xl border border-orange-100">
            <h3 className="text-xl font-bold text-orange-600">
              AI-Powered Ideas
            </h3>
            <p className="mt-2 text-gray-600">
              Get endless recipe inspiration with ingredient-based suggestions.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-xl border border-orange-100">
            <h3 className="text-xl font-bold text-orange-600">Zero Effort</h3>
            <p className="mt-2 text-gray-600">
              You don’t have to think — the app types and generates for you.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-xl border border-orange-100">
            <h3 className="text-xl font-bold text-orange-600">
              Fun Animations
            </h3>
            <p className="mt-2 text-gray-600">
              Enjoy typing simulation, recipe reveals, and smooth looping
              visuals.
            </p>
          </div>
        </div>
      </section>

      {/* Call-to-Action Banner */}
      <section className="mt-32 px-6">
        <div className="max-w-4xl mx-auto bg-orange-500 text-white p-10 rounded-3xl text-center shadow-lg">
          <h2 className="text-3xl font-bold">Ready for the Real AI Version?</h2>
          <p className="mt-3 text-lg opacity-90">
            Connect it to Gemini API for full real-time recipe generation.
          </p>
          <button className="mt-6 px-8 py-3 bg-white text-orange-600 font-bold rounded-xl hover:bg-orange-100 transition">
            Upgrade to AI Mode
          </button>
        </div>
      </section>

      {/* Fade-in animation */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.6s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
}
