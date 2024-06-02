import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  authSignInInputSchema,
  authSignupInputSchema,
  userTable,
} from "./schema";
import { hash, verify } from "@node-rs/argon2";
import database, { createSession } from "../../utils/database";
import { eq } from "drizzle-orm";

const Auth = new Hono();

Auth.post(
  "/signup",
  zValidator("json", authSignupInputSchema, (result, c) => {
    if (!result.success) {
      return c.text("Invalid!", 400);
    }
  }),
  async (c) => {
    const { email, password, name } = c.req.valid("json");

    const passwordHash = await hash(password, {
      // recommended minimum parameters
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const [user] = await database
      .insert(userTable)
      .values({ email, password: passwordHash, name })
      .returning({
        id: userTable.id,
        email: userTable.email,
        name: userTable.name,
      });
    const session = await createSession(user);
    if (session) {
      if (session) {
        const [_, cookieValue] = session?.cookie.split('=');
        c.res.headers.append("Set-Cookie", session.cookie);
        c.res.headers.append("Authorization", cookieValue.split(';')[0]);
      }
    }

    return c.json(user);
  }
); // GET Auth/

Auth.post(
  "/signin",
  zValidator("json", authSignInInputSchema, (result, c) => {
    if (!result.success) {
      return c.text("Invalid!", 400);
    }
  }),
  async (c) => {
    const { email, password } = c.req.valid("json");

    const user = await database.query.userTable.findFirst({
      where: eq(userTable.email, email),
    });

    if (!user) throw new Error("User not found");

    const validPassword = await verify(user.password, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) throw new Error("User not found");

    const session = await createSession(user);
    if (session) {
      const [_, cookieValue] = session?.cookie.split('=');
      c.res.headers.append("Set-Cookie", session.cookie);
      c.res.headers.append("Authorization", cookieValue.split(';')[0]);
    }

    return c.json({ email: user.email, id: user.id, name: user.name });
  }
); // POST Auth/

export default Auth;
