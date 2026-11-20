import { z } from "zod";
import { USER_ROLES } from "@/constants";

export const userSchema = z.object({
  _id: z.string().min(1),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(USER_ROLES),
  phone: z.string().optional(),
  flatNumber: z.string().optional(),
  building: z.string().optional(),
  avatar: z.string().optional(),
  skills: z.array(z.string()).optional(),
  hourlyRate: z.number().optional(),
  availability: z.string().optional(),
});
export const authResponseSchema = z.object({ user: userSchema, token: z.string().min(1) });
export type UserRole = typeof USER_ROLES[number];
export type AuthUser = z.infer<typeof userSchema> & { _id: string; name: string; email: string; role: UserRole };
export type AuthResponse = { user: AuthUser; token: string };
