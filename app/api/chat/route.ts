import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = messages
      .map((m: any) => `${m.role}: ${m.content}`)
      .join("\n");

    const result = await model.generateContent(prompt);

    return NextResponse.json({
      response: result.response.text(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
