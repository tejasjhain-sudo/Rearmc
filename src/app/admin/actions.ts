"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(password: string) {
  // Use env var or default to "admin" if not set for local testing
  const validPassword = process.env.ADMIN_PASSWORD || "admin";
  
  if (password === validPassword) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });
    return { success: true };
  }
  
  return { success: false, error: "Invalid password" };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}
