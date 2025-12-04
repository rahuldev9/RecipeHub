"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import PageLoader from "../components/PageLoader";
import { Camera } from "lucide-react";
type ParsedRecipe = {
  detectedIngredients: string[];
  name: string;
  cookingTime: string;
  ingredients: string[];
  instructions: string[];
  variation: string;
};

export default function ImageRecipeUploader() {
  const [preview, setPreview] = useState<string | null>(null);
  const [recipes, setRecipes] = useState<ParsedRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarReady, setSidebarReady] = useState(false); // <-- NEW

  // ----------------------------- PARSER -----------------------------
  const parseGeminiText = (text: string): ParsedRecipe[] => {
    const lines = text.split("\n").map((l) => l.trim());

    let detected: string[] = [];
    let recipes: ParsedRecipe[] = [];

    let currentRecipe: Partial<ParsedRecipe> = {
      detectedIngredients: [],
      name: "",
      cookingTime: "",
      ingredients: [],
      instructions: [],
      variation: "",
    };

    let section: string | null = null;

    for (let line of lines) {
      if (line.startsWith("Detected Ingredients:")) {
        section = "detected";
        continue;
      }
      if (line.startsWith("Recipe")) {
        if (currentRecipe.name) recipes.push(currentRecipe as ParsedRecipe);
        currentRecipe = { ingredients: [], instructions: [] };
        continue;
      }
      if (line.startsWith("Name:")) {
        section = "name";
        currentRecipe.name = line.replace("Name:", "").trim();
        continue;
      }
      if (line.startsWith("Cooking Time:")) {
        section = "time";
        currentRecipe.cookingTime = line.replace("Cooking Time:", "").trim();
        continue;
      }
      if (line.startsWith("Ingredients:")) {
        section = "ingredients";
        continue;
      }
      if (line.startsWith("Instructions:")) {
        section = "instructions";
        continue;
      }
      if (line.startsWith("Variation:")) {
        section = "variation";
        currentRecipe.variation = line.replace("Variation:", "").trim();
        continue;
      }

      if (section === "detected" && line !== "") detected.push(line);
      if (section === "ingredients" && line !== "") {
        currentRecipe.ingredients?.push(line);
      }
      if (section === "instructions" && /^[0-9]/.test(line)) {
        currentRecipe.instructions?.push(line.replace(/^[0-9]+\s*/, ""));
      }
    }

    if (currentRecipe.name) recipes.push(currentRecipe as ParsedRecipe);
    setDetectedIngredients(detected);
    return recipes;
  };

  // ----------------------------- HANDLE FILE -----------------------------
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setRecipes([]);
    setDetectedIngredients([]);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(",")[1];
      setPreview(reader.result as string);
      setLoading(true);

      try {
        const response = await fetch("/api/image-response", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 }),
        });

        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          const parsed = parseGeminiText(data.text);
          setRecipes(parsed);
        }
      } catch {
        setError("Something went wrong while fetching the recipe.");
      }

      setLoading(false);
    };

    reader.readAsDataURL(file);
  };

  // ------------------------------------------------------------------
  //                           RENDER
  // ------------------------------------------------------------------

  return (
    <div className="flex relative">
      {/* Sidebar */}
      <Sidebar
        onToggle={(open, mobile) => {
          setSidebarOpen(open);
          setIsMobile(mobile);

          if (!sidebarReady) setSidebarReady(true); // <-- MARK READY
        }}
      />

      {!sidebarReady && <PageLoader />}

      {/* MAIN CONTENT */}
      {sidebarReady && (
        <div
          className="
            flex-grow bg-white px-4 py-10 flex flex-col items-center 
            transition-all duration-300 pt-24 md:pt-20
          "
          style={{
            marginLeft: isMobile ? 0 : sidebarOpen ? 256 : 80,
          }}
        >
          <main className="flex-grow max-w-5xl mx-auto w-full px-4 py-10 space-y-10">
            {/* Upload Section */}

            <section className="p-6 bg-white rounded-2xl shadow-md border space-y-4">
              <h2 className="text-xl font-semibold">
                Generate Recipe from Image
              </h2>

              <label className="flex items-center justify-center gap-3 border-2 border-dashed border-gray-300 rounded-xl p-5 bg-gray-50 cursor-pointer hover:border-orange-400 transition-all">
                <Camera className="w-7 h-7 text-orange-500" />
                <span className="text-gray-600 font-medium">
                  Upload or Capture Image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFile}
                  className="hidden"
                />
              </label>

              {preview && (
                <img
                  src={preview}
                  alt="Uploaded preview"
                  className="w-64 mt-2 rounded-xl border shadow-md"
                />
              )}

              {loading && (
                <p className="text-blue-600 mt-2 font-medium animate-pulse">
                  Analyzing image…
                </p>
              )}

              {error && (
                <p className="text-red-600 mt-2 font-medium">{error}</p>
              )}
            </section>

            {/* Detected Ingredients */}
            {detectedIngredients.length > 0 && (
              <section className="p-6 bg-white rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold mb-3">
                  Detected Ingredients
                </h3>

                <div className="flex flex-wrap gap-2">
                  {detectedIngredients.map((ing, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Recipes */}
            {recipes.length > 0 && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recipes.map((recipe, index) => (
                  <article
                    key={index}
                    className="p-5 border rounded-xl bg-white shadow transition hover:shadow-lg"
                  >
                    <h3 className="text-xl font-bold mb-1">{recipe.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Cooking Time: {recipe.cookingTime}
                    </p>

                    <h4 className="font-semibold mt-3">Ingredients:</h4>
                    <ul className="list-disc ml-5 text-sm space-y-1">
                      {recipe.ingredients.map((ing, i) => (
                        <li key={i}>{ing}</li>
                      ))}
                    </ul>

                    <h4 className="font-semibold mt-4">Instructions:</h4>
                    <ol className="list-decimal ml-5 text-sm space-y-1">
                      {recipe.instructions.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>

                    <h4 className="font-semibold mt-4">Variation:</h4>
                    <p className="text-sm text-gray-700">{recipe.variation}</p>
                  </article>
                ))}
              </section>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
