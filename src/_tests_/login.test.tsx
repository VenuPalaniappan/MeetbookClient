import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderWithProviders } from "../test/test-utils";
import Login from "../pages/login/Login";

describe("Login page", () => {
  it("shows username & password inputs and login button", () => {
    renderWithProviders(<Login />);
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument(); // <-- was /email/i
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });
});