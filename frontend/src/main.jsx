import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { UserProvider } from "./context/UserContext";

import "./css/index.css";
import { router } from "./router.jsx";
import { AuthContextProvider } from "./context/Authentication.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </AuthContextProvider>
  </StrictMode>
);
