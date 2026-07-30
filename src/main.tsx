import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { AuthProvider } from "@/providers/auth-provider";
import App from "./App";
import "./index.css";

const convexUrl =
  import.meta.env.VITE_CONVEX_URL ??
  "https://ardent-elk-440.convex.cloud";

const convexClient = new ConvexReactClient(convexUrl);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light">
        <ConvexProvider client={convexClient}>
          <AuthProvider>
            <App />
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                duration: 4000,
              }}
            />
          </AuthProvider>
        </ConvexProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
