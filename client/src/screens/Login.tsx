/**
 * v0 by Vercel.
 * @see https://v0.dev/t/vBxetslUWAl
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Label from "@/components/ui/label";
import Input from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";
import { hc } from "hono/client";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { AppType } from "server";
import { useAtom } from "jotai";
import { AuthorizationAtom } from "@/state";

export const Login = () => {
  const client = hc<AppType>("http://localhost:3000/");
  const navigate = useNavigate();
  const [_, setAuth] = useAtom(AuthorizationAtom)

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value, formApi }) => {
      const call = await client.auth.signin.$post({
        json: { ...value },
      });

      const response = await call.json();

      
      if (call.ok && response.Authorization) {
        setAuth(response.Authorization)
        navigate("/create-group")
      }

      if (call.status === 401) {
        formApi.state.fieldMeta.email.errors.push(
          "Invalid email or password"
        );
      }
    },
  });
  return (
    <div className="flex flex-col h-[100dvh] w-[100dvw]">
      <div className="flex-1 flex items-center justify-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <Card className="w-full max-w-md p-6">
            <CardHeader>
              <CardTitle className="text-3xl">Login</CardTitle>
              <CardDescription>
                Enter your credentials to access the Tweeter app.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <form.Field
                  name="email"
                  validatorAdapter={zodValidator()}
                  validators={{
                    onChange: z
                      .string()
                      .email({ message: "Invalid email address" }),
                  }}
                  children={(field) => (
                    <>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      {field.state.meta.errors ? (
                        <em
                          role="alert"
                          className="text-xs text-right text-red-600"
                        >
                          {field.state.meta.errors.join(", ")}
                        </em>
                      ) : null}
                    </>
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <form.Field
                  name="password"
                  validatorAdapter={zodValidator()}
                  validators={{ onChange: z.string().min(8) }}
                  children={(field) => (
                    <>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                      />
                      {field.state.meta.errors ? (
                        <em
                          role="alert"
                          className="text-xs text-right text-red-600"
                        >
                          {field.state.meta.errors.join(", ")}
                        </em>
                      ) : null}
                    </>
                  )}
                />
                <CardFooter>
                  <Button className="w-full" type="submit">
                    Sign in
                  </Button>
                </CardFooter>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};
