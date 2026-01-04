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
import { baseURI } from "../Constants";
const API_BASE = `${baseURI}/api/tution-payments`;
const BULK_DELETE_TUTIONS_API = `${baseURI}/api/tution-payments/bulk`
const TutionPaymentsTable = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [selectedIds, setSelectedIds] = useState(new Set());

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


    useEffect(() => {
        fetchPayments();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, sortConfig]);


    // 🔍 Search filter
    const searchText = search?.toLowerCase() ?? "";
    const filteredPayments = payments.filter((p) => {
        const name = p?.tutionIdAndTutionName?.toLowerCase();
        return name?.includes(searchText);
    });


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
        { header: "Final Amount to Parent", key: "finalAmountToParent" },
        { header: "Amount to Tutor (Before Reg Fee)", key: "toTutorBeforeRegistration" },
        { header: "Registration Fee", key: "registrationFee" },
        { header: "Amount to Tutor (After Reg Fee)", key: "toTutorAfterRegistrationFee" },
        { header: "Payment / Hr (Parent)", key: "paymentToParentPerHr" },
        { header: "Payment / Hr (Tutor)", key: "paymentToTutorPerHr" },
        { header: "Profit", key: "profit" },
        { header: "Tutor Phone Number", key: "tutorPhoneNumber" },
        { header: "Created At", key: "createdAt" },
    ];


    // -------CheckBox Logic--------
    const isAllSelected =
        paginatedData.length > 0 &&
        paginatedData.every((p) => selectedIds.has(p.id));

    const toggleSelectAll = () => {
        const next = new Set(selectedIds);
        if (isAllSelected) {
            paginatedData.forEach((p) => next.delete(p.id));
        } else {
            paginatedData.forEach((p) => next.add(p.id));
        }
        setSelectedIds(next);
    };
    const toggleRow = (id) => {
        const next = new Set(selectedIds);
        next.has(id) ? next.delete(id) : next.add(id);
        setSelectedIds(next);
    };
    const bulkDeletePayments = async (ids) => {
        try {
            const res = await fetch(
                BULK_DELETE_TUTIONS_API,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ids }),
                }
            );

            if (!res.ok) throw new Error("Bulk delete failed");
            // Update UI
            setPayments((prev) =>
                prev.filter((p) => !ids.includes(p.id))
            );
            setSelectedIds(new Set());

        } catch (err) {
            console.error(err);
            alert("Bulk delete failed");
        }
    };


    return (
        <div style={{ padding: "20px" }}>
            <h2>Tution Message Auditing History</h2>
            {/* 🔍 Search Box */}
            <div className="tution-container">
                <div className="table-toolbar">
                    <button
                        disabled={selectedIds.size === 0}
                        onClick={() => {
                            if (
                                window.confirm(
                                    `Delete ${selectedIds.size} selected records?`
                                )
                            ) {
                                bulkDeletePayments([...selectedIds]);
                            }
                        }}
                        className="delete-btn"
                    >
                        🗑 Delete Selected ({selectedIds.size})
                    </button>

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
                        <div>
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
                    </div>
                </div>
                <div className="table-wrapper">
                    <table className="tution-table">
                        <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th onClick={() => handleSort("tutionIdAndTutionName")}>
                                    Tution ID & Tution Name{getSortIcon(sortConfig, "tutionIdAndTutionName")}
                                </th>
                                <th onClick={() => handleSort("totalDurationOfSessionTaken")}>
                                    Session Duration (hrs){getSortIcon(sortConfig, "totalDurationOfSessionTaken")}
                                </th>
                                <th onClick={() => handleSort("finalAmountToParent")}>
                                    Final Amount to Parent{getSortIcon(sortConfig, "finalAmountToParent")}
                                </th>
                                <th onClick={() => handleSort("toTutorBeforeRegistration")}>
                                    Amount to Tutor (Before Reg Fee){getSortIcon(sortConfig, "toTutorBeforeRegistration")}
                                </th>
                                <th onClick={() => handleSort("registrationFee")}>
                                    Registration Fee{getSortIcon(sortConfig, "registrationFee")}
                                </th>
                                <th onClick={() => handleSort("toTutorAfterRegistrationFee")}>
                                    Amount to Tutor (After Reg Fee){getSortIcon(sortConfig, "toTutorAfterRegistrationFee")}
                                </th>

                                <th onClick={() => handleSort("paymentToParentPerHr")}>
                                    Payment / Hr (Parent){getSortIcon(sortConfig, "paymentToParentPerHr")}
                                </th>
                                <th onClick={() => handleSort("paymentToTutorPerHr")}>
                                    Payment / Hr (Tutor){getSortIcon(sortConfig, "paymentToTutorPerHr")}
                                </th>
                                <th onClick={() => handleSort("profit")}>
                                    Profit{getSortIcon(sortConfig, "profit")}
                                </th>
                                <th>Tutor Phone Number</th>
                                <th onClick={() => handleSort("createdAt")}>
                                    Created At{getSortIcon(sortConfig, "createdAt")}
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedData.map((p) => (
                                <tr key={p.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(p.id)}
                                            onChange={() => toggleRow(p.id)}
                                        />
                                    </td>
                                    <td>{p.tutionIdAndTutionName}</td>
                                    <td>{p.totalDurationOfSessionTaken}</td>
                                    <td>₹{p.finalAmountToParent}</td>
                                    <td>₹{p.toTutorBeforeRegistration}</td>
                                    <td>₹{p.registrationFee}</td>
                                    <td>₹{p.toTutorAfterRegistrationFee}</td>
                                    <td>₹{p.paymentToParentPerHr}</td>
                                    <td>₹{p.paymentToTutorPerHr}</td>
                                    <td>₹{p.profit}</td>
                                    <td>{p.tutorPhoneNumber}</td>
                                    <td>{new Date(p.createdAt).toLocaleString()}</td>
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
