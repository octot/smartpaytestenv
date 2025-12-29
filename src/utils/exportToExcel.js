import * as XLSX from "xlsx";

/**
 * Generic Excel Export Function
 * @param {Array<Object>} data - Array of objects to export
 * @param {String} fileName - File name without extension
 * @param {String} sheetName - Excel sheet name
 */
export const exportToExcel = (
    data = [],
    fileName = "data",
    sheetName = "Sheet1"
) => {
    if (!data || data.length === 0) {
        console.warn("No data available to export");
        return;
    }

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
export const exportToExcelWithColumns = (
    data = [],
    columns = [],
    fileName = "data",
    sheetName = "Sheet1"
) => {
    if (!data.length || !columns.length) return;

    const formattedData = data.map(row => {
        const obj = {};
        columns.forEach(col => {
            obj[col.header] = row[col.key];
        });
        return obj;
    });

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
};
