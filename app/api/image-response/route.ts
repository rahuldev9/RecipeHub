import { NextResponse } from "next/server";
import { model } from "@/lib/gemini"; // Gemini model

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Image is required (Base64)." },
        { status: 400 }
      );
    }

    const prompt = `
You are a cooking assistant.

Identify all ingredients seen in the image.
Then generate 3 recipes using those ingredients.

Return EXACTLY the following format.
DO NOT use *, -, •, bullets, markdown, or bold text.
DO NOT add extra commentary.
Do NOT shorten the ingredient list.
Do NOT limit the number of steps.

=== FORMAT START ===

Detected Ingredients:
<one ingredient per line>

Recipe 1:
Name: <recipe name>
Cooking Time: <time>
Ingredients:
<one ingredient per line>
Instructions:
<numbered steps, one per line>
Variation: <optional variation>

Recipe 2:
Name: <recipe name>
Cooking Time: <time>
Ingredients:
<one ingredient per line>
Instructions:
<numbered steps, one per line>
Variation: <optional variation>

Recipe 3:
Name: <recipe name>
Cooking Time: <time>
Ingredients:
<one ingredient per line>
Instructions:
<numbered steps, one per line>
Variation: <optional variation>

=== FORMAT END ===
    `;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const text = result.response.text().trim();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Image Recipe API Error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
