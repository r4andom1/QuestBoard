import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LogIn from "./pages/LogIn";
import ErrorPage from "./pages/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage/>
  },
  {
    path: "/log-in",
    element: <LogIn/>
  }

])

