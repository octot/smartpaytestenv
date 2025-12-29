/**
 * Generic single-column sorter
 * @param {Array} data - array to sort
 * @param {Object} sortConfig - { key, direction }
 * @param {Object} options - optional config per column
 * @returns {Array}
 */
export const sortByColumn = (data, sortConfig, options = {}) => {
    if (!sortConfig?.key) return data;

    const { key, direction } = sortConfig;
    const { type = "auto" } = options[key] || {};

    return [...data].sort((a, b) => {
        let valA = a[key];
        let valB = b[key];

        // null safety
        if (valA == null) return 1;
        if (valB == null) return -1;

        // explicit type handling
        if (type === "date") {
            valA = new Date(valA);
            valB = new Date(valB);
        }

        if (type === "string" || typeof valA === "string") {
            return direction === "asc"
                ? String(valA).localeCompare(String(valB))
                : String(valB).localeCompare(String(valA));
        }

        // number (default)
        return direction === "asc" ? valA - valB : valB - valA;
    });
};
export const getNextSortConfig = (prev, key) => {
    if (prev.key === key) {
        return {
            key,
            direction: prev.direction === "asc" ? "desc" : "asc",
        };
    }
    return { key, direction: "asc" };
};

export const getSortIcon = (sortConfig, key) => {
    const isActive = sortConfig.key === key;

    if (!isActive) {
        // Inactive: show both arrows in muted color
        return (
            <span style={{ opacity: 0.3, marginLeft: '4px', fontSize: '1em' }}>
                ▲▼
            </span>
        );
    }

    // Active: highlight the relevant arrow
    if (sortConfig.direction === "asc") {
        return (
            <span style={{ marginLeft: '4px', fontSize: '1em' }}>
                <span style={{ opacity: 1 }}>▲</span>
                <span style={{ opacity: 0.2 }}>▼</span>
            </span>
        );
    } else {
        return (
            <span style={{ marginLeft: '4px', fontSize: '1em' }}>
                <span style={{ opacity: 0.2 }}>▲</span>
                <span style={{ opacity: 1 }}>▼</span>
            </span>
        );
    }

};