import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Email invalido."),
  password: z.string().min(8, "Senha deve ter no minimo 8 caracteres.")
});

export type SignInSchema = z.infer<typeof signInSchema>;
