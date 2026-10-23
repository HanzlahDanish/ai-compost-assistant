import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();
    const message = body.message;

    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 2000
    ) {
      return NextResponse.json(
        { error: "Please enter a valid message." },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    
let response;

for (let attempt = 0; attempt < 4; attempt++) {
  try {
    response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message.trim(),
      config: {
        systemInstruction:
          "You are CompostAI, a friendly educational assistant specializing in organic compost made from fruit and vegetable waste, composting, soil preparation, and gardening. Give clear, practical, scientifically responsible answers. Do not invent product prices, stock, certifications, or information about Hara Bhara Organics. If uncertain, say so rather than guessing.",
      },
    });

    break;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);

    const isTemporaryError =
      /\b(429|503|502|504|500|408)\b/.test(message) ||
      /UNAVAILABLE|RESOURCE_EXHAUSTED|INTERNAL|TIMEOUT/i.test(message);

    if (!isTemporaryError || attempt === 3) {
      throw error;
    }

    const delay = 1000 * 2 ** attempt + Math.random() * 500;

    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

if (!response) {
  throw new Error("Gemini did not return a response.");
}


    return NextResponse.json({
      reply: response.text || "Sorry, I couldn't generate an answer.",
    });
  } catch (error) {
    console.error("Gemini API error:", error);
console.error("Error details:", error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: "Sorry, I couldn't answer right now. Please try again." },
      { status: 500 }
    );
  }
}