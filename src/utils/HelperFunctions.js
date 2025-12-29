
export function formatDateToDDMMYYYY(dateInput) {
        const date = new Date(dateInput); // Accepts Date object or date string
        const day = String(date.getDate()).padStart(2, '0');      // ensures 2-digit day
        const month = String(date.getMonth() + 1).padStart(2, '0'); // JS months are 0-based
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }

export     // Calculate payment due date (example: 7 days from toDate)
    function calculateDueDate (toDate) {
        const date = new Date(toDate);
        date.setDate(date.getDate() + 7);
        return date.toLocaleDateString('en-GB').replace(/\//g, '.');
    };
export     function formatDate(dateString){
        return dateString ? dateString.split("-").reverse().join(".") : '';
    };