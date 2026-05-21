import { createClient } from "@/lib/supabase/server";
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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const email = user.email.toLowerCase();

  const { data: allowed } = await supabase
    .from("allowed_emails")
    .select("id")
    .eq("email", email)
    .maybeSingle();

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
}
