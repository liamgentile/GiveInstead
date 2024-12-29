import { z } from "zod";

export const occasionSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    type: z.enum([ "birthday", "christmas", "hanukkah", "other"]),
    startDate: z.date(),
    endDate: z.date(),
    charities: z.array(
      z.object({
        charity: z.object({
          _id: z.string(),
          name: z.string(),
          description: z.string(),
        }),
        goal: z.number().min(0),
        description: z.string(),
      })
    ),
  });