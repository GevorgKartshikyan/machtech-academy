import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/auth";

/**
 * Bulk content operations for a course.
 * POST body: { course_id, action, ...payload }
 *   action = "save_modules"  → replace all modules for the course
 *   action = "save_module"   → upsert a single module
 *   action = "delete_module" → delete a module by id
 *   action = "save_final"    → update course.final_def
 *   action = "import"        → import modules + final (replace or merge)
 */
export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { course_id, action } = body;
    if (!course_id || !action) return NextResponse.json({ error: "course_id և action պարտադիր են" }, { status: 400 });

    switch (action) {
      case "save_module": {
        const m = body.module;
        const { error } = await supabaseAdmin.from("modules").upsert({
          id: m.id, course_id, n: m.n, title: m.title,
          duration: m.duration, description: m.desc ?? m.description,
          blocks: m.blocks || [], quiz: m.quiz || []
        }, { onConflict: "id" });
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ ok: true });
      }

      case "save_modules": {
        // Replace all: delete existing, insert new
        await supabaseAdmin.from("modules").delete().eq("course_id", course_id);
        const rows = (body.modules || []).map((m: any, i: number) => ({
          id: m.id, course_id, n: i + 1, title: m.title,
          duration: m.duration, description: m.desc ?? m.description,
          blocks: m.blocks || [], quiz: m.quiz || []
        }));
        if (rows.length) {
          const { error } = await supabaseAdmin.from("modules").insert(rows);
          if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        }
        return NextResponse.json({ ok: true, count: rows.length });
      }

      case "delete_module": {
        const { error } = await supabaseAdmin.from("modules").delete().eq("id", body.module_id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ ok: true });
      }

      case "save_final": {
        const { error } = await supabaseAdmin.from("courses").update({ final_def: body.final_def }).eq("id", course_id);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ ok: true });
      }

      case "import": {
        const { mode = "replace", target = "all", data } = body; // data = parsed JSON
        if (target === "all" || target === "modules") {
          if (Array.isArray(data.modules)) {
            const importedRows = data.modules.map((m: any, i: number) => ({
              id: m.id || `m_imp_${Date.now()}_${i}`,
              course_id,
              n: i + 1,
              title: m.title, duration: m.duration,
              description: m.desc ?? m.description,
              blocks: m.blocks || [], quiz: m.quiz || []
            }));
            if (mode === "replace") {
              await supabaseAdmin.from("modules").delete().eq("course_id", course_id);
              if (importedRows.length) await supabaseAdmin.from("modules").insert(importedRows);
            } else {
              // merge: append after existing (renumber)
              const { data: existing } = await supabaseAdmin.from("modules").select("id").eq("course_id", course_id);
              const offset = (existing || []).length;
              const merged = importedRows.map((m: any, i: number) => ({ ...m, n: offset + i + 1, id: `${m.id}_${Date.now()}` }));
              if (merged.length) await supabaseAdmin.from("modules").insert(merged);
            }
          }
        }
        if ((target === "all" || target === "final") && data.final) {
          await supabaseAdmin.from("courses").update({ final_def: data.final }).eq("id", course_id);
        }
        if (target === "all") {
          const meta: any = {};
          ["title", "short_title", "description", "level", "icon"].forEach(k => {
            const src = k === "short_title" ? (data.shortTitle ?? data.short_title) : data[k];
            if (src != null) meta[k] = src;
          });
          if (Object.keys(meta).length) await supabaseAdmin.from("courses").update(meta).eq("id", course_id);
        }
        return NextResponse.json({ ok: true });
      }

      default:
        return NextResponse.json({ error: "Անհայտ action" }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.message === "FORBIDDEN" ? 403 : 401 });
  }
}
