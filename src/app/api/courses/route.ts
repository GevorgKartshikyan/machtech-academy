import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession, requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSession();
  const includeModules = req.nextUrl.searchParams.get("include") === "modules";
  const adminView = req.nextUrl.searchParams.get("admin") === "1";

  let q = supabaseAdmin.from("courses").select("*").order("position", { ascending: true });
  // If not admin, only published
  if (!adminView || session?.role !== "admin") q = q.eq("status", "published");

  const { data: courses, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (includeModules) {
    const courseIds = (courses || []).map(c => c.id);
    if (courseIds.length === 0) return NextResponse.json({ courses: [] });
    const { data: mods } = await supabaseAdmin
      .from("modules")
      .select("*")
      .in("course_id", courseIds)
      .order("n", { ascending: true });
    const byCourse: Record<string, any[]> = {};
    (mods || []).forEach(m => { (byCourse[m.course_id] ||= []).push(m); });
    const withMods = (courses || []).map(c => ({ ...c, modules: byCourse[c.id] || [] }));
    return NextResponse.json({ courses: withMods });
  }

  return NextResponse.json({ courses: courses || [] });
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    if (!body.id || !body.title) return NextResponse.json({ error: "id և title պարտադիր են" }, { status: 400 });
    const { data, error } = await supabaseAdmin
      .from("courses")
      .insert({
        id: body.id,
        title: body.title,
        short_title: body.short_title,
        description: body.description,
        level: body.level || "Foundation",
        icon: body.icon || "📘",
        status: body.status || "draft",
        access_mode: body.access_mode || "open",
        position: body.position || 0,
        final_def: body.final_def || { theory: [], logic: [], practical: [] }
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ course: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "UNAUTHORIZED" ? 401 : 403 });
  }
}
