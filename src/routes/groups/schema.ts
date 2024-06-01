import { relations } from "drizzle-orm";
import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { userTable } from "../auth/schema";

export const group = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name"),
});

export const groupRelations = relations(group, ({ many }) => ({
  members: many(userTable),
}));
