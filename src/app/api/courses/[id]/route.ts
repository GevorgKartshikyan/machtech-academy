import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin, getSession } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  const { data: course, error } = await supabaseAdmin
    .from("courses")
    .select("*")
    .eq("id", params.id)
    .single();
  if (error || !course) return NextResponse.json({ error: "Չի գտնվել" }, { status: 404 });
  if (course.status !== "published" && session?.role !== "admin") return NextResponse.json({ error: "Արգելված" }, { status: 403 });

  const { data: modules } = await supabaseAdmin
    .from("modules")
    .select("*")
    .eq("course_id", params.id)
    .order("n", { ascending: true });

  return NextResponse.json({ course: { ...course, modules: modules || [] } });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const body = await req.json();
    const patch: any = {};
    ["title", "short_title", "description", "level", "icon", "status", "access_mode", "position", "final_def"].forEach(k => {
      if (k in body) patch[k] = body[k];
    });
    const { data, error } = await supabaseAdmin
      .from("courses")
      .update(patch)
      .eq("id", params.id)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ course: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "UNAUTHORIZED" ? 401 : 403 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAdmin();
    const { error } = await supabaseAdmin.from("courses").delete().eq("id", params.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "UNAUTHORIZED" ? 401 : 403 });
  }
}
