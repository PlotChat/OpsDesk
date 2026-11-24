import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebounce } from "./use-debounce";
import { renderHook } from "@testing-library/react";
import { act } from "react";

describe("useDebounce", () => {
	beforeEach(() => {
		vi.useFakeTimers(); // Replaces real setTimeout with a controllable clock
	});

	afterEach(() => {
		vi.useRealTimers(); // Restores normal timers after each test
	});

	it("returns the initial value immediately", () => {
		const { result } = renderHook(() => useDebounce({ value: "hello" }));

		expect(result.current).toEqual("hello");
	});

	it("returns the initial value immediately when delay is 0", () => {
		const { result } = renderHook(() => useDebounce({ value: "hello", delay: 0 }));

		expect(result.current).toEqual("hello");
	});

	it("returns the initial state when the delay time has not been reached", () => {
		const { result, rerender } = renderHook(({ value }) => useDebounce({ value, delay: 500 }), {
			initialProps: { value: "hello" },
		});

		rerender({ value: "world" });
		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(result.current).toEqual("hello");
	});

	it("returns the changed state after the provided delay time", async () => {
		const { result, rerender } = renderHook(({ value }) => useDebounce({ value, delay: 500 }), {
			initialProps: { value: "hello" },
		});

		rerender({ value: "world" });

		act(() => {
			vi.advanceTimersByTime(500);
		});

		expect(result.current).toEqual("world");
	});

	it("removes any running delay timer when the value changes and makes a new one immediately", () => {
		const { result, rerender } = renderHook(({ value }) => useDebounce({ value, delay: 600 }), {
			initialProps: { value: "hello" },
		});

		// Changes to world
		rerender({ value: "world" });
		act(() => {
			vi.advanceTimersByTime(300);
		});

		// Changes to hey to see if world still persists after 500ms
		rerender({ value: "hey" });
		act(() => {
			vi.advanceTimersByTime(500);
		});
		expect(result.current).toBe("hello");

		// Check if hey applies after required time
		act(() => {
			vi.advanceTimersByTime(100);
		});
		expect(result.current).toBe("hey");
	});

	it("runs onDebounceStart immediately when value mounts or changes without changing the value", () => {
		const onDStart = vi.fn();

		const { result, rerender } = renderHook(
			({ value }) => useDebounce({ value, delay: 600, onDebounceStart: onDStart }),
			{
				initialProps: { value: "hello" },
			},
		);

		expect(onDStart).toHaveBeenCalledTimes(1);
		expect(result.current).toBe("hello");

		rerender({ value: "world" });
		expect(onDStart).toHaveBeenCalledTimes(2); // Tests if it gets called immediately on debounce
		expect(result.current).toBe("hello");

		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(onDStart).toHaveBeenCalledTimes(2); // Tests if it doesn't get called again during debounce

		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(result.current).toBe("world");
		expect(onDStart).toHaveBeenCalledTimes(2); // Tests if it doesn't get called again after debounce
	});

	it("runs onDebounceEnd ONLY at the end of the timer without changing the value", () => {
		const onDEnd = vi.fn();

		const { result } = renderHook(
			({ value }) => useDebounce({ value, delay: 600, onDebounceEnd: onDEnd }),
			{
				initialProps: { value: "hello" },
			},
		);

		expect(onDEnd).toHaveBeenCalledTimes(0); // Tests if it doesn't get called on start
		expect(result.current).toBe("hello");

		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(onDEnd).toHaveBeenCalledTimes(0); // Tests if it doesn't get called again during debounce

		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(result.current).toBe("hello");
		expect(onDEnd).toHaveBeenCalledTimes(1); // Tests if it gets called on end
	});

	it("does not fire onDebounceEnd or onDebounceStart twice when it unmounts", () => {
		const onDEnd = vi.fn();
		const onDStart = vi.fn();

		const { unmount } = renderHook(() =>
			useDebounce({ value: "hello", onDebounceEnd: onDEnd, delay: 300, onDebounceStart: onDStart }),
		);

		act(() => {
			vi.advanceTimersByTime(100);
		});

		unmount();

		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(onDEnd).toHaveBeenCalledTimes(0);
		expect(onDStart).toHaveBeenCalledTimes(1);
	});

	it("calls the latest onDebounceEnd without resetting the timer when the callback changes", () => {
		const onEndV1 = vi.fn();
		const onEndV2 = vi.fn();

		const { rerender } = renderHook(
			({ value, onDebounceEnd }) => useDebounce({ value, delay: 500, onDebounceEnd }),
			{ initialProps: { value: "hello", onDebounceEnd: onEndV1 } },
		);

		act(() => {
			vi.advanceTimersByTime(300);
		});

		rerender({ value: "hello", onDebounceEnd: onEndV2 });
		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(onEndV1).toHaveBeenCalledTimes(0);
		expect(onEndV2).toHaveBeenCalledTimes(1);
	});
});
