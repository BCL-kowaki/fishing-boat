import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "admin_session";
// シンプルなセッション管理: cookieにランダムトークンを保存
// 本格運用ではDBセッション or JWTに移行

export async function verifySession(): Promise<boolean> {
  const cookieStore = cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return token === getSessionSecret();
}

export async function requireAuth(): Promise<void> {
  const valid = await verifySession();
  if (!valid) redirect("/admin/login");
}

export async function verifyPassword(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD || "admin";
  // 平文比較（シンプル運用。本番ではbcryptハッシュ推奨）
  return password === adminPassword;
}

export function getSessionSecret(): string {
  // 固定シークレット（本番ではランダムトークン + DB保存に移行）
  return "yamato-admin-session-2026";
}

export function setSessionCookie(): void {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE, getSessionSecret(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7日
    path: "/",
  });
}

export function clearSessionCookie(): void {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE);
}
