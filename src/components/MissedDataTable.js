import React, { useState } from "react";
import {
  TablePagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from "@mui/material";
import * as XLSX from "xlsx";
import './MissedDataTable.css'
const MissedDataTable = ({
  tutorDetailsFromFirstExcel,
  tutorDetailsFromSecondExcel,
  tutorDetailsFromCombinedExcel,
  missingTutorDetailsFromCombinedExcel,
  headings,
}) => {

  const maxLength = Math.max(
    tutorDetailsFromFirstExcel.length,
    tutorDetailsFromSecondExcel.length,
    tutorDetailsFromCombinedExcel.length,
    missingTutorDetailsFromCombinedExcel.length
  );

  const combinedData = Array.from({ length: maxLength }, (_, index) => ({
    tutorDetailsFromFirstExcel: tutorDetailsFromFirstExcel[index] || "",
    tutorDetailsFromSecondExcel: tutorDetailsFromSecondExcel[index] || "",
    tutorDetailsFromCombinedExcel: tutorDetailsFromCombinedExcel[index] || "",
    missingTutorDetailsFromCombinedExcel:
      missingTutorDetailsFromCombinedExcel[index] || "",
  }));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleDownloadExcel = () => {
    const currentDate = new Date();
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Use 24-hour time
    };
    const timeStamp = currentDate.toLocaleString("en-GB", options);
    const fileName = `ViewRecords_${timeStamp}.xlsx`;
    const worksheet = XLSX.utils.json_to_sheet(combinedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName);
  };
  return (
 <TableContainer component={Paper} className="table-container">
  <div className="download-section">
    <div className="download-button-wrapper">
      <Button variant="contained" onClick={handleDownloadExcel} className="download-button">
        Download Excel
      </Button>
    </div>
  </div>
  <Table className="styled-table">
    <TableHead className="table-header">
      <TableRow>
        {headings.map((heading, index) => (
          <TableCell key={index} className="header-cell">{heading}</TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {combinedData
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        .map((row, rowIndex) => (
          <TableRow key={rowIndex} className="table-row">
            <TableCell className="table-cell">{row.tutorDetailsFromFirstExcel}</TableCell>
            <TableCell className="table-cell">{row.tutorDetailsFromSecondExcel}</TableCell>
            <TableCell className="table-cell">{row.tutorDetailsFromCombinedExcel}</TableCell>
            <TableCell className="table-cell">
              {row.missingTutorDetailsFromCombinedExcel}
            </TableCell>
          </TableRow>
        ))}
    </TableBody>
  </Table>
  <TablePagination
    rowsPerPageOptions={[5, 10, 25, 50]}
    component="div"
    count={combinedData.length}
    rowsPerPage={rowsPerPage}
    page={page}
    onPageChange={handleChangePage}
    onRowsPerPageChange={handleChangeRowsPerPage}
    className="pagination-container"
  />
</TableContainer>
  );
};

export default MissedDataTable;
