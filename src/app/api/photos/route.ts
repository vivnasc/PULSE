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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const slot = formData.get("slot") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Use JPEG, PNG, WebP or HEIC." },
        { status: 400 }
      );
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum 5MB." },
        { status: 400 }
      );
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const filename = `${user.id}/${slot || timestamp}.${ext}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("photos")
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("photos").getPublicUrl(uploadData.path);

    // Update profile photos array
    const { data: profile } = await supabase
      .from("profiles")
      .select("photos")
      .eq("id", user.id)
      .single();

    const currentPhotos: string[] = (profile?.photos as string[]) || [];
    const slotIndex = slot ? parseInt(slot) : currentPhotos.length;

    // Replace at slot or append
    const updatedPhotos = [...currentPhotos];
    if (slotIndex < updatedPhotos.length) {
      updatedPhotos[slotIndex] = publicUrl;
    } else {
      updatedPhotos.push(publicUrl);
    }

    // Keep max 6 photos
    const finalPhotos = updatedPhotos.slice(0, 6);

    await supabase
      .from("profiles")
      .update({ photos: finalPhotos })
      .eq("id", user.id);

    return NextResponse.json(
      {
        url: publicUrl,
        photos: finalPhotos,
        slot: slotIndex,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "Photo URL required" },
        { status: 400 }
      );
    }

    // Extract path from URL
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/photos\/(.+)$/);
    if (pathMatch) {
      await supabase.storage.from("photos").remove([pathMatch[1]]);
    }

    // Remove from profile photos array
    const { data: profile } = await supabase
      .from("profiles")
      .select("photos")
      .eq("id", user.id)
      .single();

    const currentPhotos: string[] = (profile?.photos as string[]) || [];
    const updatedPhotos = currentPhotos.filter((p) => p !== url);

    await supabase
      .from("profiles")
      .update({ photos: updatedPhotos })
      .eq("id", user.id);

    return NextResponse.json({ photos: updatedPhotos });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete photo" },
      { status: 500 }
    );
  }
}
