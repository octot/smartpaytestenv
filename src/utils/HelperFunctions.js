
export function formatDateToDDMMYYYY(dateInput) {
    if (!dateInput) return "";

    // If already a Date object
    if (dateInput instanceof Date) {
        const day = String(dateInput.getDate()).padStart(2, "0");
        const month = String(dateInput.getMonth() + 1).padStart(2, "0");
        const year = dateInput.getFullYear();
        return `${day}.${month}.${year}`;
    }

    // Handle "DD.MM.YYYY"
    if (typeof dateInput === "string" && dateInput.includes(".")) {
        const [day, month, year] = dateInput.split(".");
        return `${day}.${month}.${year}`;
    }

    // Fallback (ISO, timestamps)
    const date = new Date(dateInput);
    if (isNaN(date)) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
}

// Calculate payment due date (example: 7 days from toDate)
export function calculateDueDate(toDate) {
    if (!toDate) return "";

    let date;

    // Case 1: already a Date object
    if (toDate instanceof Date) {
        date = new Date(toDate);
    }
    // Case 2: "DD.MM.YYYY"
    else if (typeof toDate === "string" && toDate.includes(".")) {
        const [day, month, year] = toDate.split(".");
        date = new Date(year, month - 1, day); // JS month is 0-based
    }
    // Case 3: ISO or timestamp
    else {
        date = new Date(toDate);
    }

    if (isNaN(date)) return "";

    // ➕ Add 7 days
    date.setDate(date.getDate() + 7);

    // Format as DD.MM.YYYY
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `${dd}.${mm}.${yyyy}`;
}

export function formatDate(dateString) {
    return dateString ? dateString.split("-").reverse().join(".") : '';
};