"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { SESSION_COOKIE } from "@/lib/session";

// hardcoded demo user; replace with a call to the backend auth endpoint
const DEMO_USER = { username: "demo", password: "velox123" };

export type AuthResult = { error?: string };

const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
  });

export async function login(formData: FormData): Promise<AuthResult> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const { username, password } = parsed.data;
  if (username !== DEMO_USER.username || password !== DEMO_USER.password) {
    return { error: "Invalid username or password" };
  }

  // cookie holds the plain username; swap for the JWT/session id from Spring Security
  (await cookies()).set(SESSION_COOKIE, username, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return {};
}

export async function register(formData: FormData): Promise<AuthResult> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  // o backend registration yet; POST parsed.data to the users service when it exists
  return { error: "Registration isn't available yet. Use demo / velox123." };
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/auth");
}
