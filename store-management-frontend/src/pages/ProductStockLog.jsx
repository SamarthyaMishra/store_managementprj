import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const ProductStockLog = () => {
  const [sales, setSales] = useState([]);
  const [returns, setReturns] = useState([]);
  const [activeTab, setActiveTab] = useState("sales");
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState(""); // yyyy-mm-dd format
  const [toDate, setToDate] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'

  const [filteredSales, setFilteredSales] = useState([]);
  const [filteredReturns, setFilteredReturns] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllHistory();
  }, []);

  useEffect(() => {
    applyFiltersAndSorting();
  }, [searchTerm, fromDate, toDate, sales, returns, sortOrder]);

  const fetchAllHistory = async () => {
    setLoading(true);
    try {
      const [salesRes, returnsRes] = await Promise.all([
        axios.get("http://localhost:8080/api/sales"),
        axios.get("http://localhost:8080/api/returns"),
      ]);

      const salesData = Array.isArray(salesRes.data) ? salesRes.data : [];
      const returnsData = Array.isArray(returnsRes.data) ? returnsRes.data : [];

      setSales(salesData);
      setReturns(returnsData);
    } catch (err) {
      console.error("Error loading history:", err);
      setError("Failed to load sales or returns.");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSorting = () => {
    const term = searchTerm.toLowerCase();

    // Helper function to check date range filter
    const inDateRange = (dateStr) => {
      if (!dateStr) return false;
      const date = new Date(dateStr);
      if (fromDate && date < new Date(fromDate)) return false;
      if (toDate && date > new Date(toDate)) return false;
      return true;
    };

    // Sorting function by date
    const sortByDate = (a, b, key) => {
      if (sortOrder === "asc")
        return new Date(a[key]) - new Date(b[key]);
      else return new Date(b[key]) - new Date(a[key]);
    };

    // Filter and sort sales
    let filteredS = sales.filter((s) => {
      const custName = s.customer?.customerName?.toLowerCase() || "";
      const custMobile = s.customer?.mobileNumber || "";
      const matchesSearch =
        custName.includes(term) || custMobile.includes(term);
      const inRange = inDateRange(s.saleDate);
      return matchesSearch && (fromDate || toDate ? inRange : true);
    });
    filteredS.sort((a, b) => sortByDate(a, b, "saleDate"));

    // Filter and sort returns
    let filteredR = returns.filter((r) => {
      const custName = r.customer?.customerName?.toLowerCase() || "";
      const custMobile = r.customer?.mobileNumber || "";
      const matchesSearch =
        custName.includes(term) || custMobile.includes(term);
      const inRange = inDateRange(r.returnDate);
      return matchesSearch && (fromDate || toDate ? inRange : true);
    });
    filteredR.sort((a, b) => sortByDate(a, b, "returnDate"));

    setFilteredSales(filteredS);
    setFilteredReturns(filteredR);
  };

  const calculateTotalAmount = (list, key) =>
    list.reduce((sum, item) => sum + (item[key] || 0), 0);

  // CSV Export helper
  const exportToCSV = (data, isSale = true) => {
    if (!data.length) {
      alert("No data to export");
      return;
    }

    const headers = [
      "Customer Name",
      "Mobile Number",
      isSale ? "Sale Amount (₹)" : "Return Amount (₹)",
      "Date",
      isSale ? "Sale ID" : "Return ID",
    ];

    const rows = data.map((item) => [
      item.customer?.customerName || "",
      item.customer?.mobileNumber || "",
      isSale ? item.grossTotal : item.totalReturnAmount,
      new Date(isSale ? item.saleDate : item.returnDate).toLocaleDateString(),
      isSale ? item.saleId : item.returnId,
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${isSale ? "sales" : "returns"}_export_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  const renderTable = (data, isSale = true) => (
    <table
      border="1"
      cellPadding="8"
      cellSpacing="0"
      style={{ width: "100%", marginTop: "1rem" }}
    >
      <thead>
        <tr>
          <th>Customer Name</th>
          <th>Mobile</th>
          <th>{isSale ? "Sale Amount (₹)" : "Return Amount (₹)"}</th>
          <th
            style={{ cursor: "pointer" }}
            onClick={toggleSortOrder}
            title="Click to toggle sort order"
          >
            Date {sortOrder === "asc" ? "↑" : "↓"}
          </th>
          <th>{isSale ? "Sale ID" : "Return ID"}</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="5" align="center">
              No records found.
            </td>
          </tr>
        ) : (
          data.map((item) => (
            <tr key={isSale ? item.saleId : item.returnId}>
              <td>{item.customer?.customerName}</td>
              <td>{item.customer?.mobileNumber}</td>
              <td>{isSale ? item.grossTotal : item.totalReturnAmount}</td>
              <td>
                {new Date(
                  isSale ? item.saleDate : item.returnDate
                ).toLocaleDateString()}
              </td>
              <td>{isSale ? item.saleId : item.returnId}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  return (
    <div style={{ padding: "5rem" }}>
      <h2>Sales & Returns History</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Tabs */}
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => setActiveTab("sales")}
          style={{
            padding: "0.5rem 1rem",
            marginRight: "1rem",
            backgroundColor: activeTab === "sales" ? "#4CAF50" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Sales
        </button>

        <button
          onClick={() => setActiveTab("returns")}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: activeTab === "returns" ? "#f44336" : "#ccc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Returns
        </button>

        {/* Dashboard Button */}
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            zIndex: 1000,
          }}
        >
          <Link
            to="/dashboard"
            style={{
              textDecoration: "none",
              color: "#007bff",
              fontSize: "18px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: "600",
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1.5px solid #007bff",
              backgroundColor: "#e7f1ff",
              transition: "background-color 0.3s, color 0.3s",
            }}
            title="Go to Dashboard"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#007bff";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#e7f1ff";
              e.currentTarget.style.color = "#007bff";
            }}
          >
            <FaHome size={20} />
            Dashboard
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <input
          type="text"
          placeholder="Enter customer name or mobile number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", flex: "1" }}
        />
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={{ padding: "0.5rem" }}
          title="From date"
        />
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          style={{ padding: "0.5rem" }}
          title="To date"
        />

        <button
          onClick={() => {
            setSearchTerm("");
            setFromDate("");
            setToDate("");
          }}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#999",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          title="Clear filters"
        >
          Clear
        </button>
      </div>

      {/* Loading indicator */}
      {loading && <p>Loading data...</p>}

      {/* Content */}
      {!loading && (
        <>
          {activeTab === "sales" && (
            <>
              <p>
                Total Sales: <b>{filteredSales.length}</b>, Total Amount: ₹{" "}
                <b>{calculateTotalAmount(filteredSales, "grossTotal")}</b>
              </p>
              <button
                onClick={() => exportToCSV(filteredSales, true)}
                style={{
                  marginBottom: "1rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#4caf50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                title="Export sales to CSV"
              >
                Export Sales CSV
              </button>
              {renderTable(filteredSales, true)}
            </>
          )}

          {activeTab === "returns" && (
            <>
              <p>
                Total Returns: <b>{filteredReturns.length}</b>, Total Amount: ₹{" "}
                <b>{calculateTotalAmount(filteredReturns, "totalReturnAmount")}</b>
              </p>
              <button
                onClick={() => exportToCSV(filteredReturns, false)}
                style={{
                  marginBottom: "1rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                title="Export returns to CSV"
              >
                Export Returns CSV
              </button>
              {renderTable(filteredReturns, false)}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductStockLog;

