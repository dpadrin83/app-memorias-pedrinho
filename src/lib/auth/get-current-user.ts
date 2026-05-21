import { createClient } from "@/lib/supabase/server";
import { isPublicSupabaseEnvConfigured } from "@/lib/supabase/env";
import type { CurrentUser } from "./types";

function getInitials(name: string | null, email: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isPublicSupabaseEnvConfigured()) {
    return null;
  }

  try {
    const supabase = await createClient();

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("[auth] getSession:", sessionError.message);
      return null;
    }

    const user = session?.user;
    if (!user?.email) return null;

    const email = user.email.toLowerCase();

    const { data: allowed, error: allowedError } = await supabase
      .from("allowed_emails")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (allowedError) {
      console.error("[auth] allowed_emails:", allowedError.message);
      return null;
    }

    if (!allowed) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, name")
      .eq("id", user.id)
      .maybeSingle();

    const displayName = profile?.name ?? null;
    const displayEmail = profile?.email ?? user.email;

    return {
      id: user.id,
      email: displayEmail,
      name: displayName,
      initials: getInitials(displayName, displayEmail),
    };
  } catch (error) {
    console.error("[auth] getCurrentUser:", error);
    return null;
  }
}
