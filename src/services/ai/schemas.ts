import { z } from "zod";

export const verificationSchema = z.object({
  matched: z.boolean(),
  confidence: z.number().min(0).max(1),
  evidence: z.array(z.string()).max(8),
  explanation: z.string().min(1).max(800),
});

export type VerificationPayload = z.infer<typeof verificationSchema>;