import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { userTable } from "../auth/schema";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
import { groupTable } from "../groups/schema";

export const postTable = pgTable("post", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => userTable.id),
  groupId: integer("group_id")
    .notNull()
    .references(() => userTable.id),
  qoute: text("title").notNull(),
  isCountDown: boolean("is_count_down").notNull(),
  countDownDate: timestamp("count_down_date", {
    withTimezone: true,
    mode: "date",
  }),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .defaultNow()
    .notNull(),
});

export const postRelations = relations(postTable, ({ one }) => ({
  group: one(groupTable, {
    fields: [postTable.groupId],
    references: [groupTable.id],
  }),
  user: one(userTable, {
    fields: [postTable.userId],
    references: [userTable.id],
  })
}));

export const PostType = createInsertSchema(postTable);

export const insertPostSchema = createInsertSchema(postTable, {
  countDownDate: z.string(),
}).pick({
  qoute: true,
  content: true,
  isCountDown: true,
  countDownDate: true,
}).extend({
  groupId: z.number(),
});
