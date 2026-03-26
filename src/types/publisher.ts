import * as z from "zod";
import type { Account } from "./account.js";

export const PublisherSchema = z.object({
  "id":z.number(),
  "name": z.string(),
  "platform": z.enum(["GHOST"]),
  "owner": z.number(),
  "uuid": z.string()
})

export type PublisherDTO = z.infer<typeof PublisherSchema>;

export type Publisher = {
  "id": number,
  "name": string,
  "platform": string,
  "owner": Account,
  "uuid": string
}