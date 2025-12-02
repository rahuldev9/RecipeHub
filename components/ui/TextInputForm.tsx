"use client";

import { useState } from "react";

export default function TextInputForm({ onResult }: any) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/generate-recipe", {
      method: "POST",
      body: JSON.stringify({ userInput: text }),
    });

    const data = await res.json();
    setLoading(false);
    onResult(data.text);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        className="w-full border p-3 rounded-md"
        placeholder="Type your ingredients (e.g., eggs, tomatoes, rice)..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        {loading ? "Cooking..." : "Generate Recipe"}
      </button>
    </form>
  );
}
