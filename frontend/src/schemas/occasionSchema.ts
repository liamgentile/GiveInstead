import { z } from "zod";

export const occasionSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(40, "Name is too long"),
    description: z
      .string()
      .min(1, "Description is required")
      .max(255, "Description is too long"),
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
    start: z
      .string()
      .min(1, { message: "Start date is required" })
      .refine(
        (date) => new Date(date).getTime() > Date.now(),
        "Start date must be in the future"
      ),
    end: z
      .string()
      .min(1, { message: "End date is required" })
      .refine(
        (date) => new Date(date).getTime() > Date.now(),
        "End date must be in the future"
      ),
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
  })
  .refine(
    (data) => new Date(data.end).getTime() > new Date(data.start).getTime(),
    {
      message: "End date must be after the start date",
      path: ["end"],
    }
  );
