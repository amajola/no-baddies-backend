import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { insertPostSchema, postTable } from "./schema";
import database, { lucia } from "../../utils/database";
import { type Variables } from "../..";
import { createMiddleware } from "hono/factory";
import { desc, eq } from "drizzle-orm";
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
const Post = new Hono<{ Variables: Variables }>();

Post.use(authProtected);
Post.post(
  "/create",
  zValidator("json", insertPostSchema, (result, c) => {
    if (!result.success) {
      return c.text("Invalid!", 400);
    }
  }),
  async (c) => {
    const session = c.get("session");
    const input = c.req.valid("json");
    const [post] = await database
      .insert(postTable)
      .values({
        ...input,
        userId: session.userId,
        countDownDate:
          input.isCountDown && input.countDownDate
            ? new Date(input.countDownDate)
            : null,
      })
      .returning();

    return c.json(post);
  }
);

Post.get("/", async (c) => {
  const session = c.get("session");
  const posts = await database
    .select()
    .from(postTable)
    .where(eq(postTable.userId, session.userId))
    .orderBy(desc(postTable.createdAt));

  return c.json({ posts });
});

export default Post;
