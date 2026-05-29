import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * /admin is protected by middleware (admin-only).
 * The actual admin UI is rendered by the root App once an admin is logged in,
 * so we just bounce to "/" — the App detects the admin session and shows the panel.
 */
export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/");
  redirect("/");
}
