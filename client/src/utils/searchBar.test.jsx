
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../components/SearchBar";
import { ErrorProvider } from "../context/ErrorContext";

describe("SearchBar", () => {
    it("stops the user from sending queries by tapping 'Enter' in the searchbar", async () => {
        const user = userEvent.setup();
        const addClock = vi.fn();

        render(
            <ErrorProvider>
                <SearchBar
                    addClock={addClock}
                    addedLocations={[]}
                    darkMode={false}
                />
            </ErrorProvider>
        );

        const input = screen.getByPlaceholderText("Search for a city...");

        await user.type(input, "Paris");
        await user.keyboard("{Enter}");

        expect(addClock).not.toHaveBeenCalled();
    })
})