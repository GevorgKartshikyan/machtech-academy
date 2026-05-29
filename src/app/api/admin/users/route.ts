import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const { data: users, error } = await supabaseAdmin
      .from("users")
      .select("id, email, full_name, phone, role, group_ids, access_grants, created_at")
      .order("created_at", { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    // Also include enrollments per user
    const { data: enrollments } = await supabaseAdmin.from("enrollments").select("*");

    return NextResponse.json({ users: users || [], enrollments: enrollments || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "FORBIDDEN" ? 403 : 401 });
  }
}

/** Update a user (grants, group_ids, role) */
export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const { id, ...patch } = await req.json();
    if (!id) return NextResponse.json({ error: "id պարտադիր է" }, { status: 400 });
    const allowed: any = {};
    ["full_name", "phone", "role", "group_ids", "access_grants"].forEach(k => { if (k in patch) allowed[k] = patch[k]; });
    const { data, error } = await supabaseAdmin
      .from("users")
      .update(allowed)
      .eq("id", id)
      .select("id, email, full_name, phone, role, group_ids, access_grants")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ user: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "FORBIDDEN" ? 403 : 401 });
  }
}
