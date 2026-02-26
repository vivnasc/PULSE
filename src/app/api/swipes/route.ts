import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { swipedId, action } = await request.json();

    if (!swipedId || !action) {
      return NextResponse.json(
        { error: "swipedId and action are required" },
        { status: 400 }
      );
    }

    if (!["like", "super_like", "pass"].includes(action)) {
      return NextResponse.json(
        { error: "action must be like, super_like, or pass" },
        { status: 400 }
      );
    }

    // Insert swipe — the DB trigger handles mutual match creation
    const { data: swipe, error } = await supabase
      .from("swipes")
      .insert({
        swiper_id: user.id,
        swiped_id: swipedId,
        action,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Already swiped on this profile" },
          { status: 409 }
        );
      }
      throw error;
    }

    // Check if a match was created
    let matched = false;
    if (action !== "pass") {
      const { data: match } = await supabase
        .from("matches")
        .select("id, status")
        .or(
          `and(user_a_id.eq.${user.id},user_b_id.eq.${swipedId}),and(user_a_id.eq.${swipedId},user_b_id.eq.${user.id})`
        )
        .eq("status", "matched")
        .single();

      matched = !!match;
    }

    return NextResponse.json({ swipe, matched }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to process swipe" },
      { status: 500 }
    );
  }
}
