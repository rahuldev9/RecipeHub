import React from "react";

interface Recipe {
  name: string;
  time: string;
  ingredients: string[];
  steps: string[];
}

interface RecipeCardProps {
  content: string; // JSON string from AI
}

const RecipeCard: React.FC<RecipeCardProps> = ({ content }) => {
  const recipe: Recipe = JSON.parse(content);

  return (
    <div className="bg-white p-6 shadow-xl rounded-2xl border border-orange-100">
      <h2 className="text-3xl font-bold text-gray-900 mb-3">{recipe.name}</h2>

      <p className="text-gray-600 mb-6 text-lg">
        ⏱ <strong>{recipe.time}</strong>
      </p>

      <div className="mb-6">
        <h3 className="font-semibold text-xl mb-2">Ingredients</h3>
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          {recipe.ingredients.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-xl mb-2">Steps</h3>
        <ol className="list-decimal pl-6 space-y-2 text-gray-700">
          {recipe.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeCard;
