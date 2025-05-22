import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageProducts from "./pages/ManageProducts";
import ManageCustomers from "./pages/ManageCustomers";
import ProductStockLog from './pages/ProductStockLog';
import CreateSaleBill from "./pages/CreateSaleBill";
import SaleInvoice from './Component/SaleInvoice';

import CreateReturnBill from "./pages/CreateReturnBill";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manage-products" element={<ManageProducts />} />
        <Route path="/manage-customers" element={<ManageCustomers />} />
        <Route path="/create-sale-bill" element={<CreateSaleBill />} />
        <Route path="/invoice/:saleId" element={<SaleInvoice />} />
        <Route path="/create-return-bill" element={<CreateReturnBill />} />
        <Route path="/product-stock-log" element={<ProductStockLog />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
