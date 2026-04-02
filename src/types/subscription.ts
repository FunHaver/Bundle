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

export const SubscriptionRowSchema = z.object({
  "id": z.number(),
  "email": z.string().email(),
  "subscription_request_id": z.number(),
  "creation_date": z.coerce.date(),
  "origin": z.number(),
  "webhook_unique_id": z.string().uuid()
})

export type SubscriptionRow = z.infer<typeof SubscriptionRowSchema>

export type Subscription = {
  id: number,
  email: string,
  creationDate: Date,
  originID: number,
  webhookUniqueID: string
}
