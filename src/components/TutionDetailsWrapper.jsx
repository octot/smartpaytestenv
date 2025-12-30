// TutionDetailsWrapper.jsx
import React, { useState } from "react";
import TutionBox from './TutionBox';
import './TutionDetailsWrapper.css';
import ViewMessageTracker from "./MessageAuditingTracker/ViewMessageTracker"
const TutionDetailsWrapper = ({ combinedAndSortedData, fromDate, toDate }) => {

    console.log("TutionDetailsWrapper ",fromDate)
    const totalTutors = combinedAndSortedData.length;
    const totalSessions = combinedAndSortedData.reduce((acc, item) => {
        const tutorKey = Object.keys(item)[0];
        const tutionData = item[tutorKey];
        return acc + (tutionData.classesAttended?.length || 0);
    }, 0);
    const [searchTerm, setSearchTerm] = useState('');
    console.log("combinedAndSortedData", combinedAndSortedData)
    const filteredCombinedAndSortedData = combinedAndSortedData.filter(item => {
        const key = Object.keys(item)[0]; // Get the only key of this object
        return key.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="tuition-details-wrapper">
            <div className="tuition-details-header">
                <h2 className="tuition-details-title">Tuition Details</h2>
                <p className="tuition-details-subtitle">
                    Complete overview of tuition sessions and payments
                </p>
            </div>

            {combinedAndSortedData.length > 0 && (
                <div className="tuition-summary">
                    <h3 className="summary-title">Summary</h3>
                    <div className="summary-stats">
                        <div className="summary-stat">
                            <span className="stat-number">{totalTutors}</span>
                            <span className="stat-label">Total Tutors</span>
                        </div>

                        <div className="summary-stat">
                            <ViewMessageTracker />
                        </div>
                        <div className="summary-stat">
                            <span className="stat-number">{totalSessions}</span>
                            <span className="stat-label">Total Sessions</span>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <div>
                    <input
                        type="text"
                        placeholder="Search by Tution ID"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input" />
                </div>
                <div>
                    <div className="tuition-boxes-container">
                        {filteredCombinedAndSortedData.length > 0 ? (
                            filteredCombinedAndSortedData.map((item, index) => {
                                const tutorKey = Object.keys(item)[0];
                                const tutionData = item[tutorKey];
                                return (
                                    <TutionBox
                                        tutionData={tutionData}
                                        fromDate={fromDate}
                                        toDate={toDate}
                                        key={index}
                                        index={index}
                                    
                                    />
                                );
                            })
                        ) : (
                            <div className="no-data-message">
                                <h3 className="no-data-title">No Data Available</h3>
                                <p className="no-data-text">
                                    Please select date range and upload data to view tuition details.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutionDetailsWrapper;