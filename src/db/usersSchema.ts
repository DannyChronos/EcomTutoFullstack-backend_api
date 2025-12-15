import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import z from "zod";


export const usersTable = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 255}).notNull(),
    email: varchar({length: 255}).notNull().unique(),
    password: varchar({length: 255}).notNull(),
    role: varchar({length:255}).notNull().default('user'),
    adresse: text()
})

export const createUserSchema = createInsertSchema(usersTable).omit({
    role: true
})

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required")
})

type ApiInsertUserData = z.infer<typeof createUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;