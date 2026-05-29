import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name, phone } = await req.json();

    if (!email || !password) return NextResponse.json({ error: "Email և գաղտնաբառ պարտադիր են" }, { status: 400 });
    if (password.length < 6)  return NextResponse.json({ error: "Գաղտնաբառը պետք է լինի առնվազն 6 նիշ" }, { status: 400 });

    const emailLower = String(email).toLowerCase().trim();

    // Check duplicate
    const { data: existing } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", emailLower)
      .maybeSingle();
    if (existing) return NextResponse.json({ error: "Այս email-ով գրանցում արդեն կա" }, { status: 409 });

    const password_hash = await hashPassword(password);
    const { data, error } = await supabaseAdmin
      .from("users")
      .insert({ email: emailLower, password_hash, full_name, phone, role: "student" })
      .select("id, email, role")
      .single();

    if (error || !data) return NextResponse.json({ error: error?.message || "Գրանցումը չի հաջողվեց" }, { status: 500 });

    await setSessionCookie({ userId: data.id, email: data.email, role: data.role });

    return NextResponse.json({ ok: true, user: { id: data.id, email: data.email, role: data.role } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Սպասարկման սխալ" }, { status: 500 });
  }
}
