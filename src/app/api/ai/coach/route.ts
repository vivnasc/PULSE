import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { messages, matchProfile } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // AI Date Coach - generates contextual tips
    // In production, this calls Anthropic Claude API
    // For MVP, using rule-based coaching logic

    const lastMessages = messages.slice(-5);
    const tips: string[] = [];

    // Analyze conversation patterns
    const userMessages = lastMessages.filter(
      (m: { senderId: string }) => m.senderId === "me"
    );
    const otherMessages = lastMessages.filter(
      (m: { senderId: string }) => m.senderId !== "me"
    );

    // Tip: If match mentions a topic, suggest asking more
    if (otherMessages.length > 0) {
      const lastOther = otherMessages[otherMessages.length - 1];
      if (lastOther.content.includes("?")) {
        tips.push(
          "They asked you a question — make sure to answer thoughtfully and ask one back!"
        );
      }
    }

    // Tip: Conversation length
    if (messages.length > 20) {
      tips.push(
        "Conversation is flowing great! This might be a good time to suggest meeting in person."
      );
    }

    // Tip: Response patterns
    if (userMessages.length > 0) {
      const avgLength =
        userMessages.reduce(
          (sum: number, m: { content: string }) => sum + m.content.length,
          0
        ) / userMessages.length;
      if (avgLength < 20) {
        tips.push(
          "Try longer, more thoughtful responses to show genuine interest."
        );
      }
    }

    // Match profile-based tips
    if (matchProfile?.interests) {
      const interests = matchProfile.interests as string[];
      if (interests.length > 0) {
        tips.push(
          `They're into ${interests[0]}. Ask about their experience with it!`
        );
      }
    }

    return NextResponse.json({
      tips,
      emotionScore: Math.floor(Math.random() * 30) + 60,
      chemistry: messages.length > 10 ? "high" : "building",
    });
  } catch {
    return NextResponse.json(
      { error: "AI coaching unavailable" },
      { status: 500 }
    );
  }
}
