import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabasePublic } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

/** Public — anyone can read the overrides (landing page needs them) */
export async function GET() {
  const { data, error } = await supabasePublic
    .from("i18n_overrides")
    .select("overrides")
    .eq("id", 1)
    .single();
  if (error) return NextResponse.json({ overrides: {} });
  return NextResponse.json({ overrides: data?.overrides || {} });
}

/** Admin — replace the whole overrides object */
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin();
    const { overrides } = await req.json();
    if (typeof overrides !== "object" || Array.isArray(overrides)) {
      return NextResponse.json({ error: "Անվավեր overrides" }, { status: 400 });
    }
    const { error } = await supabaseAdmin
      .from("i18n_overrides")
      .update({ overrides })
      .eq("id", 1);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "FORBIDDEN" ? 403 : 401 });
  }
}
