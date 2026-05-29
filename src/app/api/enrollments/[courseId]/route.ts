import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const session = await requireUser();
    const { data, error } = await supabaseAdmin
      .from("enrollments")
      .select("*")
      .eq("user_id", session.userId)
      .eq("course_id", params.courseId)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ enrollment: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

/** Patch progress / quiz_scores / quiz_locked / practice / final_result */
export async function PATCH(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const session = await requireUser();
    const body = await req.json();
    const patch: any = {};
    ["progress", "quiz_scores", "quiz_locked", "practice", "final_result"].forEach(k => {
      if (k in body) patch[k] = body[k];
    });
    const { data, error } = await supabaseAdmin
      .from("enrollments")
      .update(patch)
      .eq("user_id", session.userId)
      .eq("course_id", params.courseId)
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ enrollment: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
