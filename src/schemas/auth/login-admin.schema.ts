import { z } from "zod";

export const loginAccountSchema = z.object({
  email: z.string().email("Неверный формат email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

export type TypeLoginAccountSchema = z.infer<typeof loginAccountSchema>;
