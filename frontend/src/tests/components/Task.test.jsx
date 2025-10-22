import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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
vi.mock("../../services/supabase-client", () => {
  const mockSelect = vi.fn().mockResolvedValue({ data: [], error: null });
  const mockInsert = vi.fn().mockReturnValue({ select: mockSelect });

  const mockFrom = vi.fn(() => ({
    select: mockSelect,
    insert: mockInsert,
  }));

  return {
    default: {
      from: mockFrom,
    },
  };
});

describe("Creation of adding new quest (Task.jsx)", () => {
  const user = userEvent.setup();

  it("Checking if add quest button is present on screen and if its disabled when name-input is empty", () => {
    render(<Task />);
    const addButton = screen.getByRole("button", { name: /add quest/i });

    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();
  });

  it("Checking if button is not disabled if name-input is populated", async () => {
    render(<Task />);

    const addButtons = screen.getAllByTestId("add-quest-button");
    const nameInputs = screen.getAllByPlaceholderText(/task name/i);
    const addButton = addButtons[0];
    const nameInput = nameInputs[0];

    expect(addButton).toBeDisabled();
    await user.type(nameInput, "123");
    expect(addButton).not.toBeDisabled();
  });

  it("Date input field shows on the add quest form", async () => {
    render(<Task />);

    const dateTimeInput = screen.queryByLabelText(/set expiration date & time/i);
    expect(dateTimeInput).toBeInTheDocument();
  });

  // it("Inputs for name and description is empty after clicking 'Add quest'", async () => {
  //   render(<Task />);
  //   const addButton = screen.getAllByTestId("add-quest-button")[0];
  //   const nameInput = screen.getAllByPlaceholderText(/task name/i)[0];
  //   const descriptionInput = screen.getAllByPlaceholderText(/task description/i)[0];

  //   const oneTimeRadio = screen.getAllByRole("radio", { name: /one-time/i })[0];
  //   await user.click(oneTimeRadio);
  //   const dateTimeInput = screen.getByLabelText(/Set expiration date & time/i);
  //   // expect(addButton).toBeDisabled();

  //   await user.type(nameInput, "123");
  //   await user.type(descriptionInput, "123");
  //   await user.type(dateTimeInput, "2030-01-01T12:00");

  //   await waitFor(() => {
  //     expect(addButton).not.toBeDisabled();
  //   });
  //   await user.click(addButton);

  //   await waitFor(() => {
  //     expect(nameInput).toHaveValue("");
  //     expect(descriptionInput).toHaveValue("");
  //   });
  // });
});
