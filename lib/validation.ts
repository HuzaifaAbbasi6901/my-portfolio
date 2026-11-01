import { z } from "zod";

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Please enter your name.")
    .max(80, "That name is a little too long."),
  email: z.string().email("Please enter a valid email address."),
  subject: z
    .string()
    .min(3, "Please add a short subject.")
    .max(120, "Please keep the subject under 120 characters."),
  message: z
    .string()
    .min(20, "Tell me a little more — at least 20 characters.")
    .max(5000, "Please keep the message under 5,000 characters."),
  // Honeypot — must stay empty. Real users never see this field.
  website: z.string().max(0, "Spam detected.").optional().or(z.literal("")),
});

export type ContactPayload = z.infer<typeof contactSchema>;
