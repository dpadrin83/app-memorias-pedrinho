"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";
import { generatePhotoEmbedding } from "./generate";

export type RegenerateEmbeddingsResult =
  | { ok: true; processed: number; failed: number }
  | { ok: false; error: string };

export async function regenerateAllEmbeddings(): Promise<RegenerateEmbeddingsResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, error: "Sessão inválida." };
  }

  try {
    await import("./openai").then((m) => m.getOpenAIClient());
  } catch (err) {
    const message = err instanceof Error ? err.message : "OpenAI indisponível.";
    return { ok: false, error: message };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("id")
    .is("deleted_at", null)
    .order("uploaded_at", { ascending: false });

  if (error) {
    return { ok: false, error: error.message };
  }

  let processed = 0;
  let failed = 0;

  for (const row of data ?? []) {
    const result = await generatePhotoEmbedding(row.id);
    if (result.ok) processed += 1;
    else failed += 1;
  }

  revalidatePath("/search");
  revalidatePath("/settings");

  return { ok: true, processed, failed };
}
