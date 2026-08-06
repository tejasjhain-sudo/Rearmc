import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboard from "./AdminDashboard";
import { fetchSettings, fetchTiers } from "./data-actions";

export default async function AdminPage() {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    redirect("/admin/login");
  }

  const initialSettings = await fetchSettings();
  const initialTiers = await fetchTiers();
  const { fetchProfiles } = await import("./data-actions");
  const initialProfiles = await fetchProfiles();

  return <AdminDashboard initialSettings={initialSettings} initialTiers={initialTiers} initialProfiles={initialProfiles} />;
}
