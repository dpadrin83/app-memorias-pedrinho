import { z } from "zod";

export const photoPersonSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Nome obrigatório").max(120),
  relationship: z.string().max(80).optional(),
});

export const photoFormSchema = z.object({
  title: z.string().max(200),
  description: z.string().max(20000),
  eventDate: z.string(),
  location: z.string().max(500),
  people: z.array(photoPersonSchema),
  tags: z.array(z.string().min(1).max(80)),
});

export type PhotoFormValues = z.infer<typeof photoFormSchema>;
