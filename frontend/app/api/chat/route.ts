import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `You are AgriGet's helpful assistant. AgriGet is a marketplace that connects Punjab farmers directly with businesses (MSMEs) and consumers to buy and sell fresh crops.

YOUR SCOPE — only answer questions about:
1. Farming & agriculture: crops, soil, irrigation, fertilizers, pesticides, seeds, seasons, weather, harvesting, storage
2. AgriGet marketplace: how to buy crops, how to list crops as a farmer, bulk orders, pricing, minimum order quantities, WhatsApp contact with farmers
3. Punjab farming context: local crops (wheat, rice, sugarcane, maize, vegetables, fruits), mandi prices, crop seasons in Punjab

GUARDRAIL RULES:
- If a question is completely unrelated to farming, agriculture, or the AgriGet marketplace, politely decline and redirect to your scope
- Never give medical, legal, financial investment, or political advice
- Never answer general knowledge questions unrelated to farming/agriculture
- Do not write code, essays, or generate creative content

LANGUAGE:
- Always respond in BOTH English and Punjabi (Gurmukhi script)
- Format: English answer first, then a divider "---", then the Punjabi translation
- Keep responses concise and practical for farmers and buyers

TONE: Friendly, simple, and practical. Many users are farmers who need clear, actionable advice.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (messages.length > 20) {
      return NextResponse.json({ error: "Too many messages" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.content || typeof lastMessage.content !== "string") {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    if (lastMessage.content.length > 500) {
      return NextResponse.json({ error: "Message too long (max 500 characters)" }, { status: 400 });
    }

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        max_tokens: 600,
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Groq API error:", error);
      return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
