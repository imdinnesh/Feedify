import * as z from "zod";

export const CreateSpaceSchema = z.object({
    space: z.string()
        .min(3, "Space name must be at least 3 characters")
        .max(50, "Space name must not exceed 50 characters")
        .regex(/^[a-zA-Z0-9-_]+$/, "Space name can only contain letters, numbers, hyphens, and underscores"),
    title: z.string()
        .min(5, "Title must be at least 5 characters")
        .max(100, "Title must not exceed 100 characters"),
});

