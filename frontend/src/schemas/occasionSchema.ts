import { z } from "zod";

export const occasionSchema = z.object({
  name: z.string().min(1, "Name is required").max(40, "Name is too long"),
  description: z.string().min(1, "Description is required").max(255, "Description is too long"),
  type: z.enum([
    "birthday",
    "graduation",
    "christmas",
    "hanukkah",
    "eid",
    "diwali",
    "mother's day",
    "father's day",
    "other",
  ]),
  start: z.string().min(1, { message: "Start date is required" }),
  end: z.string().min(1, { message: "End date is required" }),
  charities: z.array(
    z.object({
      charity: z.object({
        _id: z.string(),
        name: z.string(),
        description: z.string(),
      }),
    })
  ),
  url: z.string().optional(),
});
