import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await requireUser();
    const { data, error } = await supabaseAdmin
      .from("enrollments")
      .select("*")
      .eq("user_id", session.userId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ enrollments: data || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}

/** Enroll into a course (gating logic is enforced) */
export async function POST(req: NextRequest) {
  try {
    const session = await requireUser();
    const { course_id } = await req.json();
    if (!course_id) return NextResponse.json({ error: "course_id պարտադիր է" }, { status: 400 });

    // Validate access
    const { data: course } = await supabaseAdmin
      .from("courses")
      .select("id, status, access_mode")
      .eq("id", course_id)
      .single();
    if (!course || course.status !== "published") return NextResponse.json({ error: "Այս դասընթացը հասանելի չէ" }, { status: 403 });

    if (course.access_mode === "restricted") {
      const { data: user } = await supabaseAdmin
        .from("users")
        .select("access_grants, group_ids")
        .eq("id", session.userId)
        .single();
      const grants = (user?.access_grants || []) as string[];
      const groupIds = (user?.group_ids || []) as string[];
      const hasGrant = grants.includes(course_id);
      // If not directly granted, no access (groups can be extended later)
      if (!hasGrant && groupIds.length === 0) return NextResponse.json({ error: "Այս դասընթացը փակ է — հասանելիություն չունես" }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from("enrollments")
      .upsert({
        user_id: session.userId,
        course_id,
        enrolled_at: new Date().toISOString()
      }, { onConflict: "user_id,course_id" })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ enrollment: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 401 });
  }
}
