import * as z from "zod";

export const GhostMemberSchema = z.object({
  "email": z.string().email(),
  "uuid": z.string().min(1)
})

export type GhostMember = z.infer<typeof GhostMemberSchema>;

export const NewSubscriptionSchema = z.object({
  "email": z.string().email(),
  "publisherUUID": z.string().uuid(),
  "webhookUUID": z.string().uuid()
})

export type NewSubscription = z.infer<typeof NewSubscriptionSchema>