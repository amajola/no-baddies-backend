import { Hono } from "hono";
import Auth from "./routes/auth";
import Post from "./routes/posts";
import { SessionType } from "./routes/auth/schema";
import z from "zod";
import Group from "./routes/groups";
import Top from "./client";
import { cors } from "hono/cors";

export type Variables = {
  session: z.infer<typeof SessionType>;
};

const app = new Hono<{ Variables: Variables }>();

app.use("/*", cors());
app.get("/", (c) => {
  const messages = ["Good Morning", "Good Evening", "Good Night"];
  return c.html(<Top messages={messages} />);
});

const routes = app
  .route("/auth", Auth)
  .route("/posts", Post)
  .route("/groups", Group);

export type AppType = typeof routes;
export default app;
