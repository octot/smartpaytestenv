import React, { useRef, useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import * as XLSX from "xlsx";
import filterExcelData from "../utils/filterExcelData";
import secondFilteredExcelData from "../utils/secondFilteredExcelData";
import "./ExcelReader.css";
import {
  populateFilteredBasedOnIsRequired,
  transformData,
  filterRecords,
  sortAndRemoveDuplicates,
  populateTutorJsonData,
} from "../functions/functionsForSecondExcel";
import { TextField } from "@mui/material"; // Example imports
import Grid from "@mui/material/Grid";
import MissedData from "./MissedData";
import { Button } from "@mui/material";
import TutionDetailsWrapper from './TutionDetailsWrapper'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
// import { format } from 'date-fns';
const ExcelReader = () => {
  const [timeSheetEntryExcelData, setTimeSheetEntryExcelData] = useState(null);
  const [excelData2, setExcelData2] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileName2, setFileName2] = useState("");
  // 2022-01-08
  // new Date(year, monthIndex, day, hours, minutes, seconds)
  // const [fromDate, setFromDate] = useState(new Date(2025, 10, 1, 10, 0, 0));
  // const [toDate, setToDate] = useState(new Date(2025, 11, 1, 10, 0, 0));
  // const [payroll, setPayroll] = useState(new Date(2025, 11, 1, 10, 0, 0));
  // console.log("fromDate  "+fromDate);
    const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [payroll, setPayroll] = useState("");

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [grandparentChecked, setGrandparentChecked] = useState(true);
  const openPopup = () => {
    setIsPopupOpen(true);
  };
  const closePopup = () => {
    setIsPopupOpen(false);
  };
  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    const file = acceptedFiles[0];
    setFileName(file.name);
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setTimeSheetEntryExcelData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    accept: ".xlsx, .xls",
    onDrop,
  });
  const onDrop2 = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    const file = acceptedFiles[0];
    setFileName2(file.name);
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setExcelData2(jsonData);
    };
    reader.readAsArrayBuffer(file);
  }, []);
  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } =
    useDropzone({
      accept: ".xlsx, .xls",
      onDrop: onDrop2,
    });
  const handleFromDateChange = (newValue) => {
    if (newValue) {      
      setFromDate(newValue); // Keep original Date object
    }
  };
  const handleToDateChange = (newValue) => {
    if (newValue) {
      setToDate(newValue); // Keep original Date object
    }
  };
  const handlePayrollChange = (newValue) => {
    if (newValue) {
      // const formattedDate = format(newValue, 'dd-MM-yyyy');
      setPayroll(newValue); // Keep original Date object
    }
  };
  function missedStudentRecords(combinedArray, fromDate) {
    let fromDateObj = new Date(fromDate);
    for (let i = 0; i < combinedArray.length; ++i) {
      let eachStudentRecord = combinedArray[i];
      let sessionDateRecords = new Date(eachStudentRecord[3]);
      if (sessionDateRecords < fromDateObj) {
        eachStudentRecord["status"] = "(missed)";
      } else {
        eachStudentRecord["status"] = "";
      }
    }
    return combinedArray;
  }
  const filteredTimeSheetEntryExcelData = filterExcelData(
    timeSheetEntryExcelData,
    fromDate,
    toDate,
    payroll,
    "case1"
  );
  const payRollFilteredTimeSheetEntryExcelData = filterExcelData(
    timeSheetEntryExcelData,
    fromDate,
    toDate,
    payroll,
    "case2"
  );
  const recordsFromPayRollAndFilteredTimeSheetEntryExcel = [...filteredTimeSheetEntryExcelData, ...payRollFilteredTimeSheetEntryExcelData];
  const missedRecordsArray = missedStudentRecords(recordsFromPayRollAndFilteredTimeSheetEntryExcel, fromDate);

  const payRollFilteredData = [...new Set(missedRecordsArray)];
  const tutorJsonData = populateTutorJsonData(payRollFilteredData);
  
  const [copyTutorJsonData, setCopyTutorJsonData] = useState({});
  const isManuallyUpdated = useRef(false);
  useEffect(() => {
    if (
      !isManuallyUpdated.current &&
      tutorJsonData &&
      JSON.stringify(tutorJsonData) !== JSON.stringify(copyTutorJsonData)
    ) {
      setCopyTutorJsonData({ ...tutorJsonData });
    }
  }, [tutorJsonData, copyTutorJsonData]);

  const filteredBasedOnIsRequired =populateFilteredBasedOnIsRequired(copyTutorJsonData);
  const tutionStartedByHrExcelData = secondFilteredExcelData(excelData2);
  const transformedDataTutionStartedByHrExcelData = transformData(tutionStartedByHrExcelData);

  const { filteredTutorJsonData, filteredTransformedData } = filterRecords(
    filteredBasedOnIsRequired,
    transformedDataTutionStartedByHrExcelData
  );
  const combinedAndSortedData = sortAndRemoveDuplicates(
    filteredTransformedData,
    filteredTutorJsonData
  );
  const handleGrandparentCheckbox = () => {
    const newGrandparentChecked = !grandparentChecked;
    setGrandparentChecked(newGrandparentChecked);
    const updatedData = Object.keys(copyTutorJsonData).reduce(
      (acc, tutorKey) => {
        acc[tutorKey] = {
          ...copyTutorJsonData[tutorKey],
          checked: newGrandparentChecked,
          sessions: copyTutorJsonData[tutorKey].sessions.map((session) => ({
            ...session,
            isRequired: newGrandparentChecked,
          })),
        };
        return acc;
      },
      {}
    );
    setCopyTutorJsonData(updatedData);
  };
  const handleParentCheckbox = (tutorKey) => {
    const isChecked = !copyTutorJsonData[tutorKey].checked;
    setCopyTutorJsonData((prevState) => ({
      ...prevState,
      [tutorKey]: {
        ...prevState[tutorKey],
        checked: isChecked,
        sessions: prevState[tutorKey].sessions.map((session) => ({
          ...session,
          isRequired: isChecked,
        })),
      },
    }));
    isManuallyUpdated.current = true;
  };
  const handleChildCheckbox = (tutorKey, index) => {
    const updatedSessions = copyTutorJsonData[tutorKey].sessions.map(
      (session, idx) =>
        idx === index
          ? { ...session, isRequired: !session.isRequired }
          : session
    );
    const allChecked = updatedSessions.every((session) => session.isRequired);
    const noneChecked = updatedSessions.every((session) => !session.isRequired);

    setCopyTutorJsonData((prevState) => ({
      ...prevState,
      [tutorKey]: {
        ...prevState[tutorKey],
        sessions: updatedSessions,
        checked: allChecked ? true : !noneChecked,
      },
    }));
    isManuallyUpdated.current = true;
    // 

  };
  const [searchTerm, setSearchTerm] = useState('');
  const filteredTutors = Object.keys(copyTutorJsonData)
    .filter(key => key.toLowerCase().includes(searchTerm.toLowerCase()))
    .reduce((acc, key) => {
      acc[key] = copyTutorJsonData[key];
      return acc;
    }, {});

  return (
    <div>
      <div className="tuition-details-header-smart-pay">
        <h2 className="tuition-details-title-smart-pay">Smart Pay</h2>
        <p className="tuition-details-subtitle-smart-pay">
        </p>
      </div>
      <div className="container">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="From Date"
                value={fromDate}
                id="fromDate"
                onChange={handleFromDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    variant="outlined"
                    InputProps={{
                      className: "input",
                    }}
                    InputLabelProps={{
                      shrink: true,
                      style: { marginTop: "-8px" },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={handleToDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    required
                    variant="outlined"
                    InputProps={{
                      className: "input",
                    }}
                    InputLabelProps={{
                      shrink: true,
                      style: { marginTop: "-8px" },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} sm={4}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Payroll"
                value={payroll}
                onChange={handlePayrollChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    variant="outlined"
                    InputProps={{
                      className: "input",
                    }}
                    InputLabelProps={{
                      shrink: true,
                      style: { marginTop: "-8px" },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </div>
      <div {...getRootProps()} className="file-upload-container" >
        <input {...getInputProps()} className="file-upload-input" />
        {/* Display the uploaded file name */}
        <p className="file-upload-text">
          {fileName
            ? `Uploaded File: ${fileName}`
            : "Drag and drop an Excel file here, or click to select files (Timesheet Entry.xlsx)"}
        </p>
      </div>
      <div>
        {copyTutorJsonData && (
          <label className="main-checkbox">
            <input
              type="checkbox"
              checked={grandparentChecked}
              onChange={handleGrandparentCheckbox}
            />
            Select All
          </label>
        )}
        <div>
          <div>
            <input
              type="text"
              placeholder="Search by Tution ID or Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input" />
          </div>
          <div className="parent-tutors-grid">
            <div className="tutors-grid">
              {Object.keys(filteredTutors).map((tutorKey, index) => (
                <div key={tutorKey} className="tutor-card">
                  <div className="tutor-header"
                    checked={copyTutorJsonData[tutorKey].checked}
                    onClick={() => handleParentCheckbox(tutorKey)}
                  >
                    <input
                      type="checkbox"
                      checked={copyTutorJsonData[tutorKey].checked}
                      onChange={() => handleParentCheckbox(tutorKey)}
                    />
                    <h3 className="tutor-title">{tutorKey}</h3>
                  </div>
                  <ul className="sessions-list">
                    {copyTutorJsonData[tutorKey].sessions.map(
                      (session, itemIndex) => (
                        <li
                          key={`${tutorKey}-${itemIndex}`}
                          className="session-item"
                          onClick={() => handleChildCheckbox(tutorKey, itemIndex)}
                        >
                          <div className="session-content">
                            <input
                              type="checkbox"
                              checked={session.isRequired}
                              onChange={() =>
                                handleChildCheckbox(tutorKey, itemIndex)
                              }
                            />
                            <div className="session-details">
                              <span className="session-date">{session["Session Date"]}</span>
                              <span className="session-duration">{session["Duration of Session session"]}</span>
                              <span className="session-status">{session["status"]}</span>
                            </div>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div {...getRootProps2()} className="file-upload-container">
        <input {...getInputProps2()} className="file-upload-input" />
        {/* Display the uploaded file name */}
        <p className="file-upload-text">
          {fileName2
            ? `Uploaded File: ${fileName2}`
            : "Drag and drop an Excel file here, or click to select files (Tuitions started By HR.xlsx)"}
        </p>
      </div>
      <div class="button-container">
        <button className="overview-btn open-missed-data-btn" onClick={openPopup}>
          View OverView details
        </button>
      </div>

      {isPopupOpen && (
        <div className="popup-wrapper">
          <div className="popup-overlay" onClick={closePopup}></div>
          <div className="popup-container">
            <div className="popup-content-wrapper">
              <Button className="popup-close-btn" onClick={closePopup}>
                Close
              </Button>
              <div className="missed-data-container">
                <MissedData
                  tutorJsonData={tutorJsonData}
                  transformedDataTutionStartedByHrExcelData={transformedDataTutionStartedByHrExcelData}
                  combinedAndSortedData={combinedAndSortedData}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <TutionDetailsWrapper
        combinedAndSortedData={combinedAndSortedData}
        fromDate={fromDate}
        toDate={toDate}
      />
    </div>
  );
};

export default ExcelReader;
