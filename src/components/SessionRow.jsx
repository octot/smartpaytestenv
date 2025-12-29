import React from "react";
import './SessionRow.css'
const SessionRow = ({ cls }) => {
    const sessionDate = cls["Session Date"].split("-").reverse().join("-");
    const duration = cls["Duration of Session taken"];
    return (
        <div>
            <div className="session-row">
                <div className="session-date">
                    {sessionDate}
                </div>
                <div className="session-details">
                    <div className="session-duration">
                        {duration || 'N/A'}
                    </div>
                </div>
            </div>
        </div>


    );
};

export default SessionRow;
