import { NextRequest, NextResponse } from "next/server";
import { getOpenAIResponse } from "@/lib/openai-service";
import { getTogetherResponse } from "@/lib/together-service";

export async function POST(request: NextRequest) {
  try {
    const { messages, model, provider } = await request.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }
    // Use the first 3 messages for context
    const context = messages.slice(0, 3).map((m: any) => `${m.sender === "user" ? "User" : "Bot"}: ${m.text}`).join("\n");
    const prompt = `Given the following chat excerpt, generate a short, descriptive title (max 7 words) for this conversation.\n\n${context}\n\nTitle:`;
    let response: string;
    if (provider === "together") {
      response = await getTogetherResponse(prompt, [], model);
    } else {
      response = await getOpenAIResponse(prompt, [], model);
    }
    const title = response.replace(/^"|"$/g, "").trim();
    return NextResponse.json({ title });
  } catch (err) {
    console.error("[generate-title API] error:", err);
    return NextResponse.json({ error: "Failed to generate title" }, { status: 500 });
  }
} 