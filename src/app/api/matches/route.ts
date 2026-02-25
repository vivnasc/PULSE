import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: matches, error } = await supabase
      .from("matches")
      .select(
        `
        *,
        user_a:profiles!matches_user_a_id_fkey(id, display_name, photos, location_city, is_verified, last_active),
        user_b:profiles!matches_user_b_id_fkey(id, display_name, photos, location_city, is_verified, last_active)
      `
      )
      .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`)
      .eq("status", "matched")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(matches);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}
