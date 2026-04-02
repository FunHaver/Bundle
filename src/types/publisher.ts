import * as z from "zod";

export const PublisherSchema = z.object({
  "id":z.number(),
  "name": z.string(),
  "platform": z.enum(["GHOST"]),
  "owner": z.number(),
  "uuid": z.string()
})

export type Publisher = z.infer<typeof PublisherSchema>;
