import { supabasePublic } from "@/lib/supabase";
import FullApp from "@/components/FullApp";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: courses } = await supabasePublic
    .from("courses")
    .select("*")
    .eq("status", "published")
    .order("position", { ascending: true });

  const courseIds = (courses || []).map((c) => c.id);
  let modulesByCourse: Record<string, any[]> = {};
  if (courseIds.length) {
    const { data: mods } = await supabasePublic
      .from("modules")
      .select("*")
      .in("course_id", courseIds)
      .order("n", { ascending: true });
    (mods || []).forEach((m) => { (modulesByCourse[m.course_id] ||= []).push(m); });
  }
  const publishedCourses = (courses || []).map((c) => ({ ...c, modules: modulesByCourse[c.id] || [] }));

  const { data: i18nRow } = await supabasePublic
    .from("i18n_overrides")
    .select("overrides")
    .eq("id", 1)
    .single();

  return <FullApp initialCourses={publishedCourses as any[]} initialOverrides={(i18nRow?.overrides || {}) as Record<string, string>} />;
}
