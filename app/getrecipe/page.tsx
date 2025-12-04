"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import PageLoader from "../components/PageLoader";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarReady, setSidebarReady] = useState(false); // <-- NEW

  async function handleSubmit(e: any) {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setResult("");

    const res = await fetch("/api/generate-recipe", {
      method: "POST",
      body: JSON.stringify({ userInput: text }),
    });

    const data = await res.json();
    setLoading(false);

    setResult(data.text);
  }

  // --------------------------- PARSER ---------------------------
  function renderRecipe(text: string) {
    if (!text) return null;

    const cleaned = text.replace(/\*/g, "").trim();
    const recipeBlocks = cleaned.split(/Recipe \d+:/).slice(1);

    return (
      <div className="w-full flex flex-col gap-10 mt-10 pb-20">
        {recipeBlocks.map((block, index) => {
          const name =
            block.match(/Name:\s*(.+)/)?.[1]?.trim() || "Untitled Recipe";
          const time = block.match(/Cooking Time:\s*(.+)/)?.[1]?.trim() || "";

          const ingredientsBlock =
            block.match(/Ingredients:\s*([\s\S]*?)Instructions:/)?.[1] || "";

          const ingredients = ingredientsBlock
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);

          const stepsBlock =
            block.match(/Instructions:\s*([\s\S]*?)Variation:/)?.[1] || "";

          const steps = stepsBlock
            .split("\n")
            .map((l) => l.replace(/^\d+\.\s*/, "").trim())
            .filter(Boolean);

          const variation = block.match(/Variation:\s*(.+)/)?.[1]?.trim() || "";

          return (
            <div
              key={index}
              className="w-full max-w-2xl animate-fadeIn bg-white p-6 shadow-xl rounded-2xl border border-orange-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold mb-3">{name}</h2>

                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${name}\n\nIngredients:\n${ingredients.join(
                        "\n"
                      )}\n\nSteps:\n${steps.join("\n")}`
                    )
                  }
                  className="text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md border"
                >
                  Copy
                </button>
              </div>

              {time && (
                <p className="text-gray-600 mb-4">
                  ⏱ <strong>{time}</strong>
                </p>
              )}

              {ingredients.length > 0 && (
                <>
                  <h3 className="font-semibold text-xl mb-2">Ingredients</h3>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    {ingredients.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </>
              )}

              {steps.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-xl mb-2">Steps</h3>
                  <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                    {steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {variation && (
                <p className="mt-4 text-gray-700">
                  <strong>Variation:</strong> {variation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex relative">
      {/* Sidebar — responsive & synced */}
      <Sidebar
        onToggle={(open, mobile) => {
          setSidebarOpen(open);
          setIsMobile(mobile);
          if (!sidebarReady) setSidebarReady(true); // <-- MARK READY
        }}
      />

      {/* LOADER — until sidebar sends first state */}

      {!sidebarReady && <PageLoader />}

      {/* MAIN CONTENT */}
      {sidebarReady && (
        <div
          className={`
          flex-grow bg-white px-4 py-10 flex flex-col items-center 
          transition-all duration-300
          pt-24 md:pt-20
        `}
          style={{
            marginLeft: isMobile ? 0 : sidebarOpen ? 256 : 80,
          }}
        >
          {/* Hero */}
          <div className="text-center mb-10 max-w-xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 drop-shadow-sm leading-tight">
              🍳 What-to-Cook Assistant
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Enter your ingredients and instantly get delicious AI-generated
              recipes!
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl bg-white shadow-xl p-6 rounded-2xl border border-orange-100 space-y-4"
          >
            <textarea
              className="w-full border p-3 rounded-md text-gray-800 focus:border-orange-400 outline-none transition-all"
              placeholder="Type your ingredients... (e.g., chicken, garlic, rice)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
            />

            <button
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-md cursor-pointer w-full transition-all shadow-md active:scale-95"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Cooking...
                </span>
              ) : (
                "Generate Recipe"
              )}
            </button>
          </form>

          {!result && !loading && (
            <p className="text-gray-500 mt-10 text-center">
              👆 Enter ingredients to generate recipes.
            </p>
          )}

          {renderRecipe(result)}

          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
              .animate-fadeIn {
                animation: fadeIn 0.6s ease-out forwards;
              }
            `}
          </style>
        </div>
      )}
    </div>
  );
}
