import { NextRequest, NextResponse } from "next/server";
import { getOpenAIResponse, ChatMessage as OpenAIMessage } from "@/lib/openai-service";
import { getTogetherResponse, ChatMessage as TogetherMessage } from "@/lib/together-service";
import { MODEL_OPTIONS, PROVIDERS } from "@/lib/models";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [], model } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    // Find the provider for the selected model
    const modelOption = MODEL_OPTIONS.find((m) => m.value === model);
    const provider = PROVIDERS.find((p) => p.id === modelOption?.provider);

    // Log provider and model details
    console.log(`[Chat API] Provider: ${provider?.name || 'Unknown'} (${provider?.id || 'n/a'}), Model: ${modelOption?.name || model || 'Unknown'} (${modelOption?.value || 'n/a'})`);

    let response;
    if (provider?.id === 'together') {
      response = await getTogetherResponse(message, conversationHistory, model);
    } else {
      response = await getOpenAIResponse(message, conversationHistory, model);
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
