import { Hono } from "hono";
import Auth from "./routes/auth";
import { createMiddleware } from "hono/factory";
import Post from "./routes/posts";
import { lucia } from "./utils/database";
import { SessionType } from "./routes/auth/schema";
import z from "zod";

export type Variables = {
  session: z.infer<typeof SessionType>;
};

const app = new Hono<{ Variables: Variables }>()

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.route("/auth", Auth);
app.route("/posts", Post)

export default app;
