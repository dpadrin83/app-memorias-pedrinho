/**
 * Tipos do schema Postgres — espelham supabase/migrations.
 * Atualize após `supabase gen types typescript` quando o CLI estiver linkado.
 */

export type Profile = {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
  updated_at: string;
};

export type Photo = {
  id: string;
  storage_path: string;
  thumbnail_path: string;
  title: string | null;
  description: string | null;
  event_date: string | null;
  location: string | null;
  lat: number | null;
  lng: number | null;
  uploaded_by: string;
  uploaded_at: string;
  updated_at: string;
  deleted_at: string | null;
  embedding: number[] | null;
};

export type Person = {
  id: string;
  name: string;
  relationship: string | null;
  created_at: string;
};

export type Tag = {
  id: string;
  name: string;
  created_at: string;
};

export type Album = {
  id: string;
  title: string;
  description: string | null;
  cover_photo_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};
