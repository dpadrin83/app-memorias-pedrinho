"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

export async function createPerson(input: {
  name: string;
  relationship?: string;
}): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const name = input.name.trim();
  if (!name) return { ok: false, error: "Nome obrigatório." };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("people")
    .insert({
      name,
      relationship: input.relationship?.trim() || null,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, error: error?.message ?? "Erro ao criar pessoa." };
  }

  revalidatePath("/people");
  return { ok: true, id: data.id };
}

export async function updatePerson(input: {
  id: string;
  name: string;
  relationship?: string;
}): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const name = input.name.trim();
  if (!name) return { ok: false, error: "Nome obrigatório." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("people")
    .update({
      name,
      relationship: input.relationship?.trim() || null,
    })
    .eq("id", input.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/people");
  revalidatePath(`/people/${input.id}`);
  revalidatePath("/search");
  return { ok: true, id: input.id };
}

export async function deletePerson(personId: string): Promise<ActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sessão inválida." };

  const supabase = await createClient();
  const { error } = await supabase.from("people").delete().eq("id", personId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/people");
  revalidatePath("/search");
  redirect("/people");
}
