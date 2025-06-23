import { NextRequest } from "next/server";
import { getOpenAIStreamResponse, ChatMessage as OpenAIMessage } from "@/lib/openai-service";
import { getTogetherResponse, ChatMessage as TogetherMessage } from "@/lib/together-service";

const TOGETHER_MODELS = [
  "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
  "togethercomputer/llama-2-70b-chat"
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [], model } = body;

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Message is required and must be a string" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Set up Server-Sent Events
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial connection message
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "start" })}\n\n`)
          );

          if (model && TOGETHER_MODELS.includes(model)) {
            // Together does not support streaming in this codebase, so just yield the full response
            const response = await getTogetherResponse(message, conversationHistory, model);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "chunk", content: response })}\n\n`
              )
            );
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
            );
          } else {
            // Get streaming response from OpenAI
            const streamResponse = getOpenAIStreamResponse(
              message,
              conversationHistory,
              model
            );

            for await (const chunk of streamResponse) {
              // Send each chunk as a data event
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: "chunk", content: chunk })}\n\n`
                )
              );
            }

            // Send completion message
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
            );
          }
        } catch (error) {
          console.error("Streaming error:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                error: errorMessage,
              })}\n\n`
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
