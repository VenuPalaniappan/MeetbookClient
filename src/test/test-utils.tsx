import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "../context/authContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

export function renderWithProviders(
  ui: React.ReactElement,
  {
    route = "/",
    isAuthed = false,
    user = null,
    queryClient = new QueryClient(),
  }: { route?: string; isAuthed?: boolean; user?: any; queryClient?: QueryClient } = {}
) {
  window.history.pushState({}, "Test page", route);

  const authValue = {
    currentUser: isAuthed ? (user ?? { id: 1, name: "Test User" }) : null,
    login: vi.fn(),
    logout: vi.fn(),
  };

  return render(
    <GoogleOAuthProvider clientId="test-client-id">
      <QueryClientProvider client={queryClient}>
        <AuthContext.Provider value={authValue as any}>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </AuthContext.Provider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
