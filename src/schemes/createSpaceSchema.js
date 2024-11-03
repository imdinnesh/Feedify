import { z } from 'zod'

export const CreateSpaceSchema = z.object({
  space: z.string()
    .min(1, "Space name is required")
    .regex(/^[a-zA-Z0-9_-]+$/, "Space name must be a single word with no spaces. Only letters, numbers, underscore and dash are allowed"),
  title: z.string().min(1, "Heading question is required")
});

