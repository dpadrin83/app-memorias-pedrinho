import { createClient } from "npm:@supabase/supabase-js@2";

const PHOTOS_BUCKET = "photos";
const RETENTION_DAYS = 30;

Deno.serve(async (req) => {
  const cronSecret = Deno.env.get("CRON_SECRET");
  if (cronSecret) {
    const auth = req.headers.get("Authorization");
    if (auth !== `Bearer ${cronSecret}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) {
    return new Response(JSON.stringify({ error: "Missing Supabase env" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(url, serviceKey);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
  const cutoffIso = cutoff.toISOString();

  const { data: photos, error: photosError } = await supabase
    .from("photos")
    .select("id, storage_path, thumbnail_path")
    .not("deleted_at", "is", null)
    .lt("deleted_at", cutoffIso);

  if (photosError) {
    return new Response(JSON.stringify({ error: photosError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  let photosPurged = 0;
  for (const photo of photos ?? []) {
    const paths = [
      ...new Set([photo.storage_path, photo.thumbnail_path].filter(Boolean)),
    ];
    if (paths.length) {
      await supabase.storage.from(PHOTOS_BUCKET).remove(paths);
    }
    const { error } = await supabase.from("photos").delete().eq("id", photo.id);
    if (!error) photosPurged += 1;
  }

  const { data: albums, error: albumsError } = await supabase
    .from("albums")
    .select("id")
    .not("deleted_at", "is", null)
    .lt("deleted_at", cutoffIso);

  if (albumsError) {
    return new Response(JSON.stringify({ error: albumsError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const albumIds = (albums ?? []).map((a) => a.id);
  let albumsPurged = 0;

  if (albumIds.length) {
    const { error } = await supabase.from("albums").delete().in("id", albumIds);
    if (!error) albumsPurged = albumIds.length;
  }

  return new Response(
    JSON.stringify({
      ok: true,
      cutoff: cutoffIso,
      photosPurged,
      albumsPurged,
    }),
    { headers: { "Content-Type": "application/json" } },
  );
});
