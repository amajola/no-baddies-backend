import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "@/screens/Login";
import Signup from "@/screens/Signup";
import VerifyEmail from "@/screens/VerifyEmail";
import CreateGroup from "@/screens/Group";

const router = createBrowserRouter([
  {
    id: "home",
    path: "/",
    element: <App />,
    // loader: rootLoader,
  },
  { path: "login", element: <Login /> },
  { path: "signup", element: <Signup /> },
  { path: "verify-email", element: <VerifyEmail /> },
  { path: "create-group", element: <CreateGroup /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />
);
