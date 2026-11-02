import type { ReactNode } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { safeRedirect } from "../lib/redirect";
import { Spinner } from "./ui";

/** Sends visitors to Login and brings them back afterwards. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <Spinner />;
  if (!isLoggedIn) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return children;
}

/** Login/Register pages are skipped when already logged in. */
export function GuestRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  const [params] = useSearchParams();
  if (isLoading) return <Spinner />;
  if (isLoggedIn) return <Navigate to={safeRedirect(params.get("redirect"))} replace />;
  return children;
}

