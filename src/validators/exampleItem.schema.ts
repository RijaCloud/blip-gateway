import { z } from 'zod';

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export const createExampleItemSchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140).transform(normalizeSlug),
  description: z.string().trim().max(2000).optional().nullable(),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).optional().default([]),
  isActive: z.boolean().optional().default(true),
  metadata: z.record(z.any()).optional().default({})
});

export const updateExampleItemSchema = createExampleItemSchema.partial().refine(
  (payload) => Object.keys(payload).length > 0,
  'Au moins un champ doit etre fourni pour la mise a jour.'
);

export type CreateExampleItemInput = z.infer<typeof createExampleItemSchema>;
export type UpdateExampleItemInput = z.infer<typeof updateExampleItemSchema>;
