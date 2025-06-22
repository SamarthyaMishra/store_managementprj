// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import ManageProducts from "./pages/ManageProducts";
// import ManageCustomers from "./pages/ManageCustomers";
// import ProductStockLog from './pages/ProductStockLog';
// import CreateSaleBill from "./pages/CreateSaleBill";
// import SaleInvoice from './Component/SaleInvoice';

// import CreateReturnBill from "./pages/CreateReturnBill";
// import './App.css';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Navigate to="/login" />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/manage-products" element={<ManageProducts />} />
//         <Route path="/manage-customers" element={<ManageCustomers />} />
//         <Route path="/create-sale-bill" element={<CreateSaleBill />} />
//         <Route path="/invoice/:saleId" element={<SaleInvoice />} />
//         <Route path="/create-return-bill" element={<CreateReturnBill />} />
//         <Route path="/product-stock-log" element={<ProductStockLog />} />
//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
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
import PrivateRoute from './Component/PrivateRoute';
import Password from "./pages/Password"; // updated import for forgot password
import './App.css';
import './i18n';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route
          path="/login"
          element={
            localStorage.getItem('token') ? <Navigate to="/dashboard" /> : <Login />
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-products"
          element={
            <PrivateRoute>
              <ManageProducts />
            </PrivateRoute>
          }
        />
        <Route
          path="/manage-customers"
          element={
            <PrivateRoute>
              <ManageCustomers />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-sale-bill"
          element={
            <PrivateRoute>
              <CreateSaleBill />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-return-bill"
          element={
            <PrivateRoute>
              <CreateReturnBill />
            </PrivateRoute>
          }
        />
        <Route
          path="/product-stock-log"
          element={
            <PrivateRoute>
              <ProductStockLog />
            </PrivateRoute>
          }
        />
        <Route
          path="/invoice/:saleId"
          element={
            <PrivateRoute>
              <SaleInvoice />
            </PrivateRoute>
          }
        />

        {/* <Route
          path="/forgot-password"
          element={<Password />} // route for password reset page
        /> */}

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
