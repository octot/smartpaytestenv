import React, { useEffect, useMemo, useState } from "react";
import {
    sortByColumn,
    getNextSortConfig,
    getSortIcon,
} from "../../utils/SingleSortByColumn";
import { exportToExcelWithColumns }
    from '../../utils/exportToExcel'
import { paginate } from "../../utils/paginationUtils";
import "./TutionTable.css";
import {baseURI } from "../Constants";
const API_BASE = `${baseURI}/api/tution-payments`;
const TutionPaymentsTable = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    // sorting state
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });

    // Fetch data
    const fetchPayments = async () => {
        try {
            const res = await fetch(API_BASE);
            const data = await res.json();
            setPayments(data);
        } catch (err) {
            console.error("Failed to fetch payments", err);
        } finally {
            setLoading(false);
        }
    };

    // Delete payment
    const deletePayment = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this record?"
        );
        if (!confirmDelete) return;

        try {
            await fetch(`${API_BASE}/${id}`, {
                method: "DELETE",
            });

            // Remove deleted row from UI
            setPayments((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, sortConfig]);


    // 🔍 Search filter
    const filteredPayments = payments.filter((p) =>
        p.tutionIdAndTutionName
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    // Sorting logic 
    const sortedPayments = React.useMemo(() => {
        return sortByColumn(filteredPayments, sortConfig, {
            createdAt: { type: "date" },
            tutionIdAndTutionName: { type: "string" },
        });

    }, [filteredPayments, sortConfig]);

    const handleSort = (key) => {
        setSortConfig((prev) => getNextSortConfig(prev, key));
    }


    const { paginatedData, totalPages } = useMemo(() => {
        return paginate(sortedPayments, currentPage, pageSize);
    }, [sortedPayments, currentPage, pageSize]);

    if (loading) return <p>Loading payments...</p>;
    const columns = [
        { header: "Tution ID & Tution Name", key: "tutionIdAndTutionName" },
        { header: "Session Duration (hrs)", key: "totalDurationOfSessionTaken" },
        { header: "Parent Phone Number", key: "parentPhoneNumber" },
        { header: "Payment / Hr (Parent)", key: "paymentToParentPerHr" },
        { header: "Payment / Hr (Tutor)", key: "paymentToTutorPerHr" },
        { header: "Amount to Tutor (Before Reg Fee)", key: "toTutorBeforeRegistration" },
        { header: "Registration Fee", key: "registrationFee" },
        { header: "Amount to Tutor (After Reg Fee)", key: "toTutorAfterRegistrationFee" },
        { header: "Final Amount to Parent", key: "finalAmountToParent" },
        { header: "Profit", key: "profit" },
        { header: "Created At", key: "createdAt" },
    ];

    return (
        <div style={{ padding: "20px" }}>
            <h2>Tution Message Auditing History</h2>
            {/* 🔍 Search Box */}
            <div className="tution-container">
                <div>
                    <input
                        type="text"
                        placeholder="Search by tution id or tutor name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="excel-btn-wrapper">
                    <button
                        className="excel-btn"
                        onClick={() =>
                            exportToExcelWithColumns(
                                payments,
                                columns,
                                "tution-payment-report",
                                "Payments"
                            )
                        }
                    >
                        ⬇ Export to Excel
                    </button>
                </div>
                <div className="table-wrapper">
                    <table className="tution-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort("tutionIdAndTutionName")}>
                                    Tution{getSortIcon(sortConfig, "tutionIdAndTutionName")}
                                </th>
                                <th onClick={() => handleSort("totalDurationOfSessionTaken")}>
                                    Total Hours{getSortIcon(sortConfig, "totalDurationOfSessionTaken")}
                                </th>
                                <th onClick={() => handleSort("finalAmountToParent")}>
                                    Parent Amount{getSortIcon(sortConfig, "finalAmountToParent")}
                                </th>
                                <th>Parent Phone</th>
                                <th onClick={() => handleSort("paymentToTutorPerHr")}>
                                    Tutor / Hr{getSortIcon(sortConfig, "paymentToTutorPerHr")}
                                </th>
                                <th onClick={() => handleSort("paymentToParentPerHr")}>
                                    Parent / Hr{getSortIcon(sortConfig, "paymentToParentPerHr")}
                                </th>
                                <th onClick={() => handleSort("toTutorBeforeRegistration")}>
                                    Tutor Before Reg{getSortIcon(sortConfig, "toTutorBeforeRegistration")}
                                </th>
                                <th onClick={() => handleSort("registrationFee")}>
                                    Reg Fee{getSortIcon(sortConfig, "registrationFee")}
                                </th>
                                <th onClick={() => handleSort("toTutorAfterRegistrationFee")}>
                                    Tutor After Reg{getSortIcon(sortConfig, "toTutorAfterRegistrationFee")}
                                </th>
                                <th onClick={() => handleSort("profit")}>
                                    Profit{getSortIcon(sortConfig, "profit")}
                                </th>
                                <th onClick={() => handleSort("createdAt")}>
                                    Created At{getSortIcon(sortConfig, "createdAt")}
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedData.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.tutionIdAndTutionName}</td>
                                    <td>{p.totalDurationOfSessionTaken}</td>
                                    <td>₹{p.finalAmountToParent}</td>
                                    <td>{p.parentPhoneNumber}</td>
                                    <td>₹{p.paymentToTutorPerHr}</td>
                                    <td>₹{p.paymentToParentPerHr}</td>
                                    <td>₹{p.toTutorBeforeRegistration}</td>
                                    <td>₹{p.registrationFee}</td>
                                    <td>₹{p.toTutorAfterRegistrationFee}</td>
                                    <td>₹{p.profit}</td>
                                    <td>{new Date(p.createdAt).toLocaleString()}</td>
                                    <td>
                                        <button
                                            onClick={() => deletePayment(p.id)}
                                            style={{
                                                background: "#e53935",
                                                color: "#fff",
                                                border: "none",
                                                padding: "6px 10px",
                                                cursor: "pointer",
                                                borderRadius: "4px",
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {paginatedData.length === 0 && (
                                <tr>
                                    <td colSpan="12" style={{ textAlign: "center" }}>
                                        No records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Controls */}

                <div className="pagination">
                    <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                        >
                            Prev
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                style={{
                                    fontWeight: currentPage === i + 1 ? "bold" : "normal",
                                }}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                        >
                            Next
                        </button>
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setCurrentPage(1);
                                setPageSize(Number(e.target.value));
                            }}
                            style={{ marginLeft: "12px", padding: "6px" }}
                        >
                            <option value={5}>5 / page</option>
                            <option value={10}>10 / page</option>
                            <option value={20}>20 / page</option>
                        </select>
                    </div>

                </div>

            </div>
        </div>
    );

};

export default TutionPaymentsTable;
