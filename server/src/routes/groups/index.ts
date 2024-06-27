import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import database, { lucia } from "../../utils/database";
import { type Variables } from "../..";
import { createMiddleware } from "hono/factory";
import { eq } from "drizzle-orm";
import {
  GroupInsertMemberType,
  GroupInsertType,
  groupTable,
  usersToGroups,
} from "./schema";
import { HTTPException } from "hono/http-exception";
export const authProtected = createMiddleware(async (c, next) => {
  const token = c.req.header("Authorization");

  const sessionId = lucia.readBearerToken(token ?? "");
  const { session } = await lucia.validateSession(sessionId ?? "");
  if (!session) {
    return c.text("Unauthorized", 401);
  }
  c.set("session", session);
  await next();
});

const Group = new Hono<{ Variables: Variables }>()
  .use(authProtected)
  .post(
    "/create",
    zValidator("json", GroupInsertType, (result, c) => {
      if (!result.success) {
        return c.text("Invalid!", 400);
      }
    }),
    async (c) => {
      const { name } = c.req.valid("json");
      const session = c.get("session");
      const group = await database
        .insert(groupTable)
        .values({ name })
        .returning({
          groupId: groupTable.id,
          name: groupTable.name,
        })
        .catch(() => {
          throw new HTTPException(401, {
            message: "Group Name already exists",
          });
        });

      await database
        .insert(usersToGroups)
        .values({
          groupId: group[0].groupId,
          userId: session.userId,
          role: "admin",
          groupName: name as string,
        })
        .returning();

      return c.json(group);
    }
  )
  .post(
    "/add-member",
    zValidator("json", GroupInsertMemberType, (result, c) => {
      if (!result.success) {
        return c.text("Invalid!", 400);
      }
    }),
    async (c) => {
      const { id, user } = c.req.valid("json");
      const group = await database.query.groupTable.findFirst({
        where: eq(groupTable.id, id),
      });

      if (!group) throw new Error("Group not found");
      await database
        .insert(usersToGroups)
        .values({
          groupId: group.id,
          userId: user.userId,
          role: user.role,
          groupName: group.name as string,
        })
        .returning();

      return c.json({ message: "ok" });
    }
  );

export default Group;
