// src/_tests_/posts.test.tsx
import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../test/test-utils";
import Posts from "../components/posts/Posts";

vi.mock("../axios", () => {
  const makeRequest = { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };
  return { makeRequest };
});
import { makeRequest } from "../axios";

describe("Posts list", () => {
  it("renders posts from API", async () => {
    (makeRequest.get as any).mockResolvedValueOnce({
      data: [
        {
          id: 1,
          desc: "Hello world",     // what your Post component renders
          userId: 1,
          userName: "Test User",   // ensure a name is present
          createdAt: "2025-01-01",
        },
      ],
    });

    // Provide an authenticated user so currentUser is not null
    renderWithProviders(<Posts userId={1} />, {
      isAuthed: true,
      user: { id: 1, name: "Auth User" },
    });

    await waitFor(() => {
      expect(screen.getByText("Hello world")).toBeInTheDocument();
    });
  });
});
