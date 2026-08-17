import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import Map from "../components/Map";
import Error from "../components/Error";
import { ErrorProvider, useErrors } from "../context/ErrorContext";

vi.mock("axios");
vi.mock("@maptiler/leaflet-maptilersdk", () => ({
    MaptilerLayer: vi.fn(),
    MapStyle: {},
    Language: {},
}));

const AddErrorsButton = () => {
    const { addError } = useErrors();
    return (
        <button onClick={() => { addError("Test error 1"); addError("Test error 2"); }}>
            Add Errors
        </button>
    );
};

describe("Error messages", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("Error component", () => {
        const getErrorButton = () => {
            return screen.getAllByRole("button").find(btn => btn.classList.contains("text-red-500") || btn.classList.contains("text-zinc-900"));
        };

        it("toggles the error popup when clicking the button", async () => {
            render(
                <ErrorProvider>
                    <Error />
                </ErrorProvider>
            );

            const button = getErrorButton();
            expect(button).toBeInTheDocument();

            await fireEvent.click(button);
            expect(screen.getByText("No errors.")).toBeInTheDocument();

            await fireEvent.click(button);
            expect(screen.queryByText("No errors.")).not.toBeInTheDocument();
        });

        it("closes the error popup when clicking outside", async () => {
            render(
                <ErrorProvider>
                    <div>
                        <Error />
                        <button data-testid="outside">Outside</button>
                    </div>
                </ErrorProvider>
            );

            const button = getErrorButton();
            await fireEvent.click(button);
            expect(screen.getByText("No errors.")).toBeInTheDocument();

            await fireEvent.click(screen.getByTestId("outside"));
            expect(screen.queryByText("No errors.")).not.toBeInTheDocument();
        });

        it("displays 'No errors.' when there are no errors and popup is open", async () => {
            render(
                <ErrorProvider>
                    <Error />
                </ErrorProvider>
            );

            const button = getErrorButton();
            await fireEvent.click(button);
            expect(screen.getByText("No errors.")).toBeInTheDocument();
        });

        it("displays error messages when errors exist", async () => {
            render(
                <ErrorProvider>
                    <AddErrorsButton />
                    <Error />
                </ErrorProvider>
            );

            await fireEvent.click(screen.getByText("Add Errors"));

            const button = getErrorButton();
            await fireEvent.click(button);

            expect(screen.getByText("Test error 1")).toBeInTheDocument();
            expect(screen.getAllByText("Test error 2").length).toBeGreaterThanOrEqual(1);
        });

        it("clears all errors when clicking 'Clear all'", async () => {
            render(
                <ErrorProvider>
                    <AddErrorsButton />
                    <Error />
                </ErrorProvider>
            );

            await fireEvent.click(screen.getByText("Add Errors"));

            const button = getErrorButton();
            await fireEvent.click(button);

            expect(screen.getByText("Test error 1")).toBeInTheDocument();

            const clearButton = screen.getByText("Clear all");
            await fireEvent.click(clearButton);

            await fireEvent.click(button);
            expect(screen.getByText("No errors.")).toBeInTheDocument();
        });
    });

    describe("SearchBar errors", () => {
        it("shows error when server returns non-array response", async () => {
            const addClock = vi.fn();

            axios.get.mockResolvedValue({ data: "unexpected response" });

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
            fireEvent.change(input, { target: { value: "Paris" } });

            await waitFor(() => {
                expect(axios.get).toHaveBeenCalledWith(
                    expect.stringContaining("search?city=Paris"),
                    expect.any(Object)
                );
            }, { timeout: 3000 });
        });

        it("shows error when search request fails", async () => {
            const addClock = vi.fn();

            axios.get.mockRejectedValue(new Error("Network error"));

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
            fireEvent.change(input, { target: { value: "Paris" } });

            await waitFor(() => {
                expect(axios.get).toHaveBeenCalled();
            }, { timeout: 3000 });
        });
    });

    describe("Map errors", () => {
        it("shows error when MaptilerLayer fails to initialize", async () => {
            const { MaptilerLayer } = await import("@maptiler/leaflet-maptilersdk");
            MaptilerLayer.mockImplementation(() => {
                throw new Error("Map initialization failed");
            });

            render(
                <ErrorProvider>
                    <Map locations={[]} darkMode={false} />
                </ErrorProvider>
            );

            await waitFor(() => {
                expect(MaptilerLayer).toHaveBeenCalled();
            }, { timeout: 3000 });
        });
    });
});
