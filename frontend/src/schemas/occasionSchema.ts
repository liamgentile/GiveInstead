import { z } from "zod";

export const occasionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    type: z.enum([ "birthday", "graduation", "christmas", "hanukkah", "eid", "diwali", "mother's day", "father's day", "other"]),
    start: z.string(),
    end: z.string(),
    charities: z.array(
      z.object({
        charity: z.object({
          _id: z.string(),
          name: z.string(),
          description: z.string(),
        }),
      })
    ),
  });