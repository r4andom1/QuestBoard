import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import ErrorPage from "./pages/ErrorPage";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import RestrictedRoute from "./components/RestrictedRoute";
import Profile from "./components/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RestrictedRoute>
        <App />
      </RestrictedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/profile",
    element: (
      <RestrictedRoute>
        <Profile />
      </RestrictedRoute>
    ),
  },
]);
