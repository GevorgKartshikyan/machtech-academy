import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email և գաղտնաբառ պարտադիր են" }, { status: 400 });

    const emailLower = String(email).toLowerCase().trim();

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, email, password_hash, role")
      .eq("email", emailLower)
      .maybeSingle();

    if (error || !user) return NextResponse.json({ error: "Սխալ email կամ գաղտնաբառ" }, { status: 401 });

    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return NextResponse.json({ error: "Սխալ email կամ գաղտնաբառ" }, { status: 401 });

    await setSessionCookie({ userId: user.id, email: user.email, role: user.role });

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email, role: user.role } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Սպասարկման սխալ" }, { status: 500 });
  }
}
