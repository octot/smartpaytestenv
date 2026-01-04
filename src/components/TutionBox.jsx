import React from "react";
import SessionRow from "./SessionRow";
import WhatsAppSender from "./WhatsappSender"
import { formatDate, formatDateToDDMMYYYY, calculateDueDate } from "../utils/HelperFunctions"
import './TutionBox.css'


const TutionBox = ({ tutionData, fromDate, toDate, index }) => {


    const classesAttended = tutionData.classesAttended;
    if (!classesAttended?.length) return;
    const tutorName =
        classesAttended[0]?.["Tution ID and Tuttion Name"]?.split(" : ")[1];
    const tutorId =
        classesAttended[0]?.["Tution ID and Tuttion Name"]?.split(" : ")[0];
    const totalFees = tutionData.finalAmountToParent;
    const totalDurationOfSessionTaken = tutionData.totalDurationOfSessionTaken;
    const toNewDate = calculateDueDate(toDate);
    const formatedFromDate = formatDate(formatDateToDDMMYYYY(fromDate));
    const formatedToDate = formatDate(formatDateToDDMMYYYY(toDate));
    return (
        <div key={index} className="tution-box">
            <div className="company-header">
                <h3 className="company-name">SMARTPOINT E-PAY</h3>
                <p className="company-subtitle">Class hour updates</p>
                <p className="date-range">
                    ({formatedFromDate} - {formatedToDate})
                </p>
            </div>
            <div className="tutor-info">
                <p className="tutor-name">Tutor Name: {tutorName}</p>
                <p className="tutor-id">Tuition ID: {tutorId}</p>
            </div>

            <div className="sessions-section">
                <p className="sessions-header">Session Date and Duration of Session:</p>
                <div className="sessions-table-header">
                    <span className="header-date">Date</span>
                    <span className="header-duration">Duration(hrs)</span>
                </div>
                <div className="sessions-list">
                    {classesAttended && classesAttended.map((cls, clsIndex) => (
                        <SessionRow key={clsIndex} cls={cls} />
                    ))}
                </div>
            </div>

            <div className="summary-section">
                <div className="summary-row">
                    <span className="summary-label">Total class hours:</span>
                    <span className="summary-value">{totalDurationOfSessionTaken}</span>
                </div>
                <div className="summary-row">
                    <span className="summary-label">Total Fees:</span>
                    <span className="summary-value">₹{totalFees}</span>
                </div>
            </div>
            <div className="payment-section">
                <h4 className="payment-title">Payment Details</h4>
                <div className="payment-details">
                    <div className="payment-detail">
                        <div className="payment-label">Account No:</div>
                        <div className="payment-value">39891065373</div>
                    </div>
                    <div className="payment-detail">
                        <div className="payment-label">IFSC CODE:</div>
                        <div className="payment-value">SBIN0009485</div>
                    </div>
                    <div className="payment-detail amount-payable">
                        <div className="payment-label">Amount payable:</div>
                        <div className="payment-value">₹{totalFees}/-</div>
                    </div>
                    <div className="payment-detail">
                        <div className="payment-label">PhonePe:</div>
                        <div className="payment-value">+91 8848083747</div>
                    </div>
                    <div className="payment-detail due-date">
                        <div className="payment-label">Payment due date:</div>
                        <div className="payment-value">{toNewDate}</div>
                    </div>
                </div>

                <div className="payment-note">
                    <p className="payment-note-text">
                        Note: Please confirm the payment by sharing a screenshot
                    </p>
                </div>
            </div>
            <div className="whatsapp-section">
                <WhatsAppSender tutionData={tutionData} formatedFromDate={formatedFromDate} formatedToDate={formatedToDate} />
            </div>

        </div>
    );
};

export default TutionBox;
