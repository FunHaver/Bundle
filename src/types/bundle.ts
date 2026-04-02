import * as z from "zod";

export const BundleSchema = z.object({
  "id": z.number(),
  "name": z.string(),
  "bundle_account_duration_unit": z.enum(["DAY", "WEEK", "MONTH", "YEAR"]),
  "bundle_account_duration_amount": z.number(),
  "bundle_expiration": z.string().nullable()
});

export type Bundle = z.infer<typeof BundleSchema>;
