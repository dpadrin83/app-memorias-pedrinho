"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

export async function createTag(name: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const normalized = name.trim().toLowerCase();
  if (!normalized) return { ok: false, error: "Nome obrigatório." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tags")
    .insert({ name: normalized })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Esta tag já existe." };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/tags");
  return { ok: true, id: data.id };
}

export async function updateTag(
  id: string,
  name: string,
): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const normalized = name.trim().toLowerCase();
  if (!normalized) return { ok: false, error: "Nome obrigatório." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("tags")
    .update({ name: normalized })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "Já existe outra tag com este nome." };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/tags");
  revalidatePath(`/tags/${id}`);
  revalidatePath("/search");
  return { ok: true, id };
}

export async function deleteTag(tagId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const supabase = await createClient();
  const { error } = await supabase.from("tags").delete().eq("id", tagId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/tags");
  revalidatePath("/search");
  redirect("/tags");
}
