"use client";

import { useState } from "react";
import TextInputForm from "@/components/ui/TextInputForm";
import RecipeCard from "@/components/ui/RecipeCard";

export default function Home() {
  const [result, setResult] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white px-4 py-10 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 drop-shadow-sm">
          🍳 What-to-Cook Assistant
        </h1>
        <p className="text-lg text-gray-600 mt-2 max-w-lg">
          Enter ingredients and instantly discover delicious, AI-generated
          recipes!
        </p>
      </div>

      {/* Input Section */}
      <div className="w-full max-w-xl bg-white shadow-lg p-6 rounded-2xl border border-orange-100">
        <TextInputForm onResult={setResult} />
      </div>

      {/* Recipe Output */}
      {result && (
        <div className="w-full max-w-2xl mt-10 animate-fadeIn">
          <RecipeCard content={result} />
        </div>
      )}

      {/* Animation Styles */}
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
  );
}
