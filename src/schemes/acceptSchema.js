import * as z from "zod";

export const AcceptMessageSchema = z.object({
    acceptMessages: z.boolean().default(false),
});