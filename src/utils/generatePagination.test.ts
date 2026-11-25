import { describe, expect, it } from "vitest";
import { generatePagination } from "./generatePagination";

describe("generatePagination", () => {
	it("returns an empty array when totalPages is 0 or negative", () => {
		expect(generatePagination(1, 0)).toEqual([]);
		expect(generatePagination(1, -1)).toEqual([]);
	});

	it("returns all page numbers without ellipsis when totalPages is 7 or less", () => {
		expect(generatePagination(1, 5)).toEqual([1, 2, 3, 4, 5]);
		expect(generatePagination(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
	});

	it("shows trailing ellipsis when currentPage is among the first 3 pages", () => {
		expect(generatePagination(2, 10)).toEqual([1, 2, 3, 4, 5, "...", 10]);
	});

	it("shows both ellipses when currentPage is in the middle", () => {
		expect(generatePagination(5, 10)).toEqual([1, "...", 4, 5, 6, "...", 10]);
	});

	it("shows leading ellipsis when currentPage is among the last 3 pages", () => {
		expect(generatePagination(9, 10)).toEqual([1, "...", 6, 7, 8, 9, 10]);
	});

	it("clamps out-of-bounds currentPage values to valid page windows", () => {
		expect(generatePagination(100, 10)).toEqual([1, "...", 6, 7, 8, 9, 10]);
	});
});