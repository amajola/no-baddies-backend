import { Hono } from "hono";
import Auth from "./routes/auth";
import Post from "./routes/posts";
import { SessionType } from "./routes/auth/schema";
import z from "zod";
import Group from "./routes/groups";
import Top from "./client";

export type Variables = {
  session: z.infer<typeof SessionType>;
};

const app = new Hono<{ Variables: Variables }>();

app.get("/", (c) => {
  const messages = ["Good Morning", "Good Evening", "Good Night"];
  return c.html(<Top messages={messages} />);
});

app.route("/auth", Auth);
app.route("/posts", Post);
app.route("/groups", Group);

export default app;
