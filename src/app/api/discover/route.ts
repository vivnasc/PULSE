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

    // Get current user's profile for preferences
    const { data: myProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!myProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Use the DB function for smart discovery
    const { data: profiles, error } = await supabase.rpc(
      "get_discover_profiles",
      {
        user_id: user.id,
        user_lat: myProfile.location_lat,
        user_lng: myProfile.location_lng,
        max_dist_km: myProfile.max_distance_km,
        min_age: myProfile.age_range_min,
        max_age: myProfile.age_range_max,
        gender_pref: myProfile.gender_preference,
        result_limit: 20,
      }
    );

    if (error) {
      // Fallback: if RPC fails (e.g., function not yet deployed), do a simple query
      const { data: fallbackProfiles, error: fallbackError } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id)
        .eq("is_active", true)
        .eq("is_banned", false)
        .eq("onboarding_completed", true)
        .limit(20);

      if (fallbackError) throw fallbackError;

      // Filter out already-swiped profiles client-side
      const { data: mySwipes } = await supabase
        .from("swipes")
        .select("swiped_id")
        .eq("swiper_id", user.id);

      const swipedIds = new Set(mySwipes?.map((s) => s.swiped_id) || []);
      const filtered = (fallbackProfiles || []).filter(
        (p) => !swipedIds.has(p.id)
      );

      return NextResponse.json(filtered);
    }

    return NextResponse.json(profiles);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch discover profiles" },
      { status: 500 }
    );
  }
}
