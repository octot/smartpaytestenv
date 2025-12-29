/**
 * Paginate data
 * @param {Array} data - full dataset
 * @param {number} currentPage - current page number (1-based)
 * @param {number} pageSize - items per page
 * @returns {Object}
 */
export const paginate = (data, currentPage, pageSize) => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
        paginatedData: data.slice(startIndex, endIndex),
        totalPages,
        totalItems,
    };
};
