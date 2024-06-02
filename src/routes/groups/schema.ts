import { relations } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
} from "drizzle-orm/pg-core";
import { userTable } from "../auth/schema";
import { postTable } from "../posts/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const groupTable = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: text("name"),
});

export const groupRelations = relations(groupTable, ({ many }) => ({
  users: many(userTable),
}));

export const roleEnum = pgEnum("role", ["admin", "member"]);
export const usersToGroups = pgTable(
  "users_to_groups",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => userTable.id),
    groupId: integer("group_id")
      .notNull()
      .references(() => groupTable.id),
    role: roleEnum("role").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.groupId] }),
  })
);

export const usersToGroupsRelations = relations(usersToGroups, ({ one }) => ({
  group: one(groupTable, {
    fields: [usersToGroups.groupId],
    references: [groupTable.id],
  }),
  user: one(userTable, {
    fields: [usersToGroups.userId],
    references: [userTable.id],
  }),
}));

export const GroupInsertMemberType = z.object({
  id: z.number(),
  user: z.object({ userId: z.number(), role: z.enum(roleEnum.enumValues) }),
});

export const GroupInsertType = createInsertSchema(groupTable).pick({
  name: true,
});
