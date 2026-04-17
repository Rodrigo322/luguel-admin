import { z } from "zod";

export const createBoostSchema = z.object({
  listingId: z.string().uuid("Selecione um anuncio valido."),
  amount: z.number().positive("Valor deve ser maior que zero."),
  days: z.number().int().min(1, "Minimo de 1 dia.").max(30, "Maximo de 30 dias."),
  paymentConfirmed: z.boolean()
});

export type CreateBoostSchema = z.infer<typeof createBoostSchema>;
