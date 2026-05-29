/* eslint-disable no-console */
/**
 * Seed script — run with: npm run seed
 * Populates the database with:
 *   1. Admin user (admin@machtech.am / admin1234)
 *   2. CRM Foundation course with 9 modules + final test
 *   3. Automation Pro course (draft, empty)
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import {createClient} from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import {DEFAULT_MODULES, DEFAULT_FINAL} from "../src/lib/default-content";
import {config} from "dotenv";

config({path: ".env"});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@machtech.am";
const ADMIN_PASS = process.env.ADMIN_DEFAULT_PASSWORD || "admin1234";

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {auth: {persistSession: false}});

async function seed() {
    console.log("🌱 Starting seed...\n");

    // 1. Admin user
    console.log("👤 Creating admin user...");
    const hash = await bcrypt.hash(ADMIN_PASS, 10);
    const {error: adminErr} = await supabase
        .from("users")
        .upsert({
            email: ADMIN_EMAIL,
            password_hash: hash,
            full_name: "Administrator",
            role: "admin"
        }, {onConflict: "email"});
    if (adminErr) {
        console.error("❌ Admin error:", adminErr);
        process.exit(1);
    }
    console.log(`   ✓ ${ADMIN_EMAIL} / ${ADMIN_PASS}\n`);

    // 2. CRM Foundation course
    console.log("📚 Creating CRM Foundation course...");
    const {error: courseErr} = await supabase
        .from("courses")
        .upsert({
            id: "crm-foundation",
            title: "CRM ներդրման հիմունքներ — Foundation",
            short_title: "CRM Foundation",
            description: "Հիմնական ուսուցում CRM-ի էությունից մինչև Bitrix24-ի ներդրման մտածողություն։ Անվճար նախնական դասընթաց՝ ուղղված ստաժավորման ընտրությանը։",
            level: "Foundation",
            icon: "🎯",
            status: "published",
            access_mode: "open",
            position: 0,
            final_def: DEFAULT_FINAL
        }, {onConflict: "id"});
    if (courseErr) {
        console.error("❌ Course error:", courseErr);
        process.exit(1);
    }

    // 3. Modules
    console.log("📖 Creating 9 modules...");
    for (const mod of DEFAULT_MODULES) {
        const {error} = await supabase
            .from("modules")
            .upsert({
                id: mod.id,
                course_id: "crm-foundation",
                n: mod.n,
                title: mod.title,
                duration: mod.duration,
                description: mod.desc,
                blocks: mod.blocks,
                quiz: mod.quiz
            }, {onConflict: "id"});
        if (error) {
            console.error(`❌ Module ${mod.id}:`, error);
            process.exit(1);
        }
        console.log(`   ✓ ${mod.id} — ${mod.title}`);
    }

    // 4. Automation Pro (draft)
    console.log("\n📘 Creating Automation Pro (draft)...");
    await supabase.from("courses").upsert({
        id: "automation-pro",
        title: "Bitrix24 Automation Pro",
        short_title: "Automation Pro",
        description: "Խորացված դասընթաց՝ robots, triggers, ինտեգրացիաներ, REST API և բարդ բիզնես պրոցեսների ինքնաշխատացում։ Միայն ստաժավորման հաջող անցածներին։",
        level: "Advanced",
        icon: "⚡",
        status: "draft",
        access_mode: "restricted",
        position: 1,
        final_def: {theory: [], logic: [], practical: []}
    }, {onConflict: "id"});

    console.log("\n✅ Seed complete!\n");
    console.log("───────────────────────────────────────");
    console.log(`  Admin login:  ${ADMIN_EMAIL}`);
    console.log(`  Password:     ${ADMIN_PASS}`);
    console.log("───────────────────────────────────────\n");
    console.log("👉 Run: npm run dev   then open http://localhost:3000\n");
}

seed().catch((e) => {
    console.error(e);
    process.exit(1);
});
