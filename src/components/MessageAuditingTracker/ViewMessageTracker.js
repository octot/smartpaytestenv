import { useState } from "react";
import TutionPayments from "./TutionPaymentsTable";
import "./ViewMessageTracker.css"
const ViewMessageTracker = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button className="tracker-btn" onClick={() => setOpen(true)}>
                Tution Message Auditing History
            </button>
            {
                open && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <button className="close-btn" onClick={() => setOpen(false)}>
                                ✕
                            </button>
                            {/* Your full component */}

                            <div className="modal-table-wrapper">
                                <TutionPayments />
                            </div>
                        </div>

                    </div>

                )
            }

        </>

    )

}

export default ViewMessageTracker;