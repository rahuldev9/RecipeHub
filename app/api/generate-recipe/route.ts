import { NextResponse } from "next/server";
import { model } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const { userInput } = await req.json();

    const prompt = `
You are a helpful cooking assistant.
User gives ingredients or cravings: "${userInput}"

Return:
1. 3 recipe options
2. Each with:
   - Name
   - Cooking time
   - Ingredients list
   - Step-by-step instructions
   - One optional variation
Keep it simple and beginner-friendly.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
