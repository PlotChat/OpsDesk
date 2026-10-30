export const generatePagination = (currentPage: number, totalPages: number) => {
    // If the total number of pages is 7 or less, show all pages
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // If current page is among the first 3 pages: show 1, 2, 3, 4, 5, ..., LastPage
    if (currentPage <= 3) {
        return [1, 2, 3, 4, 5, "...", totalPages];
    }

    // If current page is among the last 3 pages: show 1, ..., Last-4, Last-3, Last-2, Last-1, Last
    if (currentPage >= totalPages - 2) {
        return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    // If current page is somewhere in the middle: show 1, ..., Prev, Current, Next, ..., Last
    return [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
    ];
};