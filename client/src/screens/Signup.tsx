/**
 * v0 by Vercel.
 * @see https://v0.dev/t/GZ11eiXtJVQ
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
import { AppType } from "server";
import { hc } from "hono/client";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const client = hc<AppType>("http://localhost:3000/");
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
    onSubmit: async ({ value, formApi }) => {
      const submitValues = {
        name: value.name,
        email: value.email,
        password: value.password,
      };

      const { status, ok } = await client.auth.signup.$post({
        json: { ...submitValues },
      });

      if (ok) {
        navigate("/login");
      }
      
      if (status === 401) {
        formApi.state.fieldMeta.email.errors.push(
          "This email is already taken"
        );
      }
    },
  });

  return (
    <div className="flex flex-col h-[100dvh] w-[100dvw]">
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md p-6">
          <CardHeader>
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Create a new account to access the Tweeter app.
            </CardDescription>
          </CardHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <form.Field
                  name="name"
                  validatorAdapter={zodValidator()}
                  validators={{
                    onChange: z
                      .string()
                      .min(3, "First name must be at least 3 characters"),
                  }}
                  children={(field) => (
                    <>
                      <Input
                        name={field.name}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        id="name"
                        placeholder="John Doe"
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <form.Field
                  name="confirmPassword"
                  validatorAdapter={zodValidator()}
                  validators={{
                    onChange: z
                      .string({ message: "Passwords do not match" })
                      .min(8, {
                        message: "Password must be at least 8 characters",
                      })
                      .refine((val) => val === form.state.values.password, {
                        message: "Passwords don't match",
                      }),
                  }}
                  children={(field) => (
                    <>
                      <Input
                        id="confirm-password"
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
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit">
                Sign Up
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
