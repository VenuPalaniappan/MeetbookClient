import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../test/test-utils";
import ProtectedRoute from "../layouts/ProtectedRoute.jsx";
import { screen } from "@testing-library/react";

describe("ProtectedRoute", () => {
  it("blocks when not authed", () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Secret</div>
      </ProtectedRoute>,
      { isAuthed: false }
    );
    expect(screen.queryByText("Secret")).not.toBeInTheDocument();
  });

  it("renders children when authed", () => {
    renderWithProviders(
      <ProtectedRoute>
        <div>Secret</div>
      </ProtectedRoute>,
      { isAuthed: true }
    );
    expect(screen.getByText("Secret")).toBeInTheDocument();
  });
});
