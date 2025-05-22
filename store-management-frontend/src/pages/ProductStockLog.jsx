import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductStockLog = () => {
  const [sales, setSales] = useState([]);
  const [returns, setReturns] = useState([]);
  const [activeTab, setActiveTab] = useState("sales");
  const [searchTerm, setSearchTerm] = useState("");

  const [filteredSales, setFilteredSales] = useState([]);
  const [filteredReturns, setFilteredReturns] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    
    fetchAllHistory();
  }, []);

  useEffect(() => {
  const term = searchTerm.toLowerCase();

  const filteredS = sales.filter(
    (s) =>
      s.customer?.customerName?.toLowerCase().includes(term) ||
      s.customer?.mobileNumber?.includes(term)
  );

  const filteredR = returns.filter(
    (r) =>
      r.customer?.customerName?.toLowerCase().includes(term) ||
      r.customer?.mobileNumber?.includes(term)
  );

  setFilteredSales(filteredS);
  setFilteredReturns(filteredR);
}, [searchTerm, sales, returns]);
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
      setFilteredSales(salesData);

      setReturns(returnsData);
      setFilteredReturns(returnsData);
    } catch (err) {
      console.error("Error loading history:", err);
      setError("Failed to load sales or returns.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();

    const filteredS = sales.filter(
      (s) =>
        s.customer?.customerName?.toLowerCase().includes(term) ||
        s.customer?.mobile?.includes(term)
    );

    const filteredR = returns.filter(
      (r) =>
        r.customer?.customerName?.toLowerCase().includes(term) ||
        r.customer?.mobile?.includes(term)
    );

    setFilteredSales(filteredS);
    setFilteredReturns(filteredR);
  };

  const calculateTotalAmount = (list, key = "totalAmount") =>
    list.reduce((sum, item) => sum + (item[key] || 0), 0);

  const renderTable = (data, isSale = true) => (
    <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", marginTop: "1rem" }}>
      <thead>
        <tr>
          <th>Customer Name</th>
          <th>Mobile</th>
          <th>{isSale ? "Sale Amount (₹)" : "Return Amount (₹)"}</th>
          <th>Date</th>
          <th>{isSale ? "Sale ID" : "Return ID"}</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan="5" align="center">No records found.</td>
          </tr>
        ) : (
          data.map((item) => (
            <tr key={isSale ? item.saleId : item.returnId}>
              <td>{item.customer?.customerName}</td>
              <td>{item.customer?.mobileNumber}</td>
              <td>{isSale ? item.grossTotal : item.totalReturnAmount}</td>
              <td>{new Date(isSale ? item.saleDate : item.returnDate).toLocaleDateString()}</td>
              <td>{isSale ? item.saleId : item.returnId}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  return (
    <div style={{ padding: "2rem" }}>
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
          }}
        >
          Returns
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter customer name or mobile number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "0.5rem", width: "300px" }}
        />
        <button onClick={handleSearch} style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}>
          Search
        </button>
      </div>

      {/* Stats */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ marginBottom: "1rem" }}>
          <strong>
            Total {activeTab === "sales" ? "Sales" : "Returns"}:{" "}
            {activeTab === "sales" ? filteredSales.length : filteredReturns.length}
          </strong>{" "}
          |{" "}
          <strong>
            Total Amount: ₹
            {activeTab === "sales"
              ? calculateTotalAmount(filteredSales, "totalAmount")
              : calculateTotalAmount(filteredReturns, "totalReturnAmount")}
          </strong>
        </div>
      )}

      {/* Table */}
      {!loading &&
        (activeTab === "sales"
          ? renderTable(filteredSales, true)
          : renderTable(filteredReturns, false))}
    </div>
  );
};

export default ProductStockLog;
