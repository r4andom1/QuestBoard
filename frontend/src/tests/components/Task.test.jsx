import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Task from "../../components/Task";
import "@testing-library/jest-dom/vitest";
import userEvent from "@testing-library/user-event";

// Mock User context
vi.mock("../../context/UserContext.jsx", () => ({
  useUser: () => ({
    fetchUserData: vi.fn(),
    userStats: { quests_created: 0, quests_completed: 0 },
  }),
}));

// Mock Auth context
vi.mock("../../context/Authentication.jsx", () => ({
  UserAuth: () => ({
    session: { user: { id: "user-id" } },
  }),
}));

// Mock database
vi.mock("../../services/supabase-client", () => ({
  default: {
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  },
}));

describe("Creation of adding new quest (Task.jsx)", () => {
  it("Checking if add quest button is present on screen and if its disabled when name-input is empty", () => {
    render(<Task />);
    const addButton = screen.getByRole("button", { name: /add quest/i });

    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();
  });

  it("Checking if button is not disabled if name-input is populated", () => {
    render(<Task />);
    // const addButton = screen.getByRole("button", { name: /add quest/i });
    // userEvent.
    // expect(addButton).toBeDisabled();
  });

  it("Inputs for name and description is empty after pressing 'Add quest'", () => {});
});
