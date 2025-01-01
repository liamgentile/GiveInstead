import { z } from "zod";

export const donationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    amount: z.number().min(1, "Amount must be greater than 0"),
    message: z.string().optional(),
  });