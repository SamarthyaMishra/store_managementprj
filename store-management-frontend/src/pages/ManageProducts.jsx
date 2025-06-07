
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { createProduct, getAllProducts, updateProduct, deleteProduct } from "./Service/ProductService";
// import { useNavigate } from "react-router-dom";

// const ManageProducts = () => {
//   const navigate = useNavigate();  // for navigation

//   const [products, setProducts] = useState([]);
//   const [units, setUnits] = useState([]);
//   const [formData, setFormData] = useState({
//     productName: "",
//     productCode: "",
//     unitName: "",
//     quantity: "",
//     buyingPrice: "",
//     sellingPriceRetail: "",
//     sellingPriceWholesale: "",
//   });
//   const [editingIdentifier, setEditingIdentifier] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     loadProducts();
//     loadUnits();
//   }, []);

//   const loadProducts = async () => {
//     setLoading(true);
//     try {
//       const response = await getAllProducts();
//       const data = Array.isArray(response.data) ? response.data : [];
//       setProducts(data);
//     } catch (error) {
//       console.error("Error loading products:", error);
//       setError("Failed to load products. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadUnits = async () => {
//     try {
//       const response = await axios.get("http://localhost:8080/api/units");
//       setUnits(response.data);
//     } catch (error) {
//       console.error("Error loading units:", error);
//       setError("Failed to load units. Please try again later.");
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const {
//       productName,
//       productCode,
//       unitName,
//       quantity,
//       buyingPrice,
//       sellingPriceRetail,
//       sellingPriceWholesale,
//     } = formData;

//     setLoading(true);
//     setError("");

//     try {
//       const selectedUnit = units.find((unit) => unit.unitName === unitName);

//       if (!selectedUnit) {
//         setError("Invalid unit selected");
//         return;
//       }

//       const productData = {
//         productName,
//         productCode,
//         unit: selectedUnit,
//         quantity: Number(quantity),
//         buyingPrice: Number(buyingPrice),
//         sellingPriceRetail: Number(sellingPriceRetail),
//         sellingPriceWholesale: Number(sellingPriceWholesale),
//       };

//       if (editingIdentifier) {
//         await updateProduct(editingIdentifier, productData);
//         setEditingIdentifier(null);
//       } else {
//         await createProduct(productData);
//       }

//       setFormData({
//         productName: "",
//         productCode: "",
//         unitName: "",
//         quantity: "",
//         buyingPrice: "",
//         sellingPriceRetail: "",
//         sellingPriceWholesale: "",
//       });

//       loadProducts();
//     } catch (error) {
//       console.error("Error submitting product:", error);
//       setError("Failed to submit product. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (product) => {
//     setEditingIdentifier(product.productId);
//     setFormData({
//       productName: product.productName,
//       productCode: product.productCode,
//       unitName: product.unit?.unitName || "",
//       quantity: product.quantity,
//       buyingPrice: product.buyingPrice,
//       sellingPriceRetail: product.sellingPriceRetail,
//       sellingPriceWholesale: product.sellingPriceWholesale,
//     });
//   };

//   const handleDelete = async (identifier) => {
//     setLoading(true);
//     setError("");

//     try {
//       await deleteProduct(identifier);
//       loadProducts();
//     } catch (error) {
//       console.error("Error deleting product:", error);
//       setError("Failed to delete product. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: "2rem" }}>
//       {/* Dashboard Button with icon and text */}
//       <button
//         onClick={() => navigate("/dashboard")}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "0.5rem",
//           marginBottom: "1rem",
//           padding: "0.5rem 1rem",
//           cursor: "pointer",
//           backgroundColor: "#1976d2",
//           color: "#fff",
//           border: "none",
//           borderRadius: "4px",
//           fontWeight: "bold",
//         }}
//         title="Go to Dashboard"
//       >
//         {/* Simple Dashboard/Home icon SVG */}
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           height="20"
//           viewBox="0 0 24 24"
//           width="20"
//           fill="white"
//         >
//           <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
//         </svg>
//         Dashboard
//       </button>

//       <h1>Manage Products</h1>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
//         <input
//           type="text"
//           name="productName"
//           placeholder="Product Name"
//           value={formData.productName}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="text"
//           name="productCode"
//           placeholder="Product Code"
//           value={formData.productCode}
//           onChange={handleChange}
//           required
//         />

//         <select
//           name="unitName"
//           value={formData.unitName}
//           onChange={handleChange}
//           required
//         >
//           <option value="">Select Unit</option>
//           {units.map((unit) => (
//             <option key={unit.unitId} value={unit.unitName}>
//               {unit.unitName}
//             </option>
//           ))}
//         </select>

//         <input
//           type="number"
//           name="quantity"
//           placeholder="Quantity"
//           value={formData.quantity}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="number"
//           name="buyingPrice"
//           placeholder="Buying Price"
//           value={formData.buyingPrice}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="number"
//           name="sellingPriceRetail"
//           placeholder="Retail Price"
//           value={formData.sellingPriceRetail}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="number"
//           name="sellingPriceWholesale"
//           placeholder="Wholesale Price"
//           value={formData.sellingPriceWholesale}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit" disabled={loading} style={{ marginTop: "1rem" }}>
//           {editingIdentifier ? "Update" : "Add"} Product
//         </button>
//       </form>

//       <h2>Products</h2>

//       {loading ? (
//         <p>Loading products...</p>
//       ) : products.length === 0 ? (
//         <p>No products found. Please add a new product.</p>
//       ) : (
//         <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
//           <thead style={{ backgroundColor: "#eee" }}>
//             <tr>
//               <th>Name</th>
//               <th>Code</th>
//               <th>Unit</th>
//               <th>Quantity</th>
//               <th>Buying Price</th>
//               <th>Retail Price</th>
//               <th>Wholesale Price</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((prod) => (
//               <tr key={prod.productId}>
//                 <td>{prod.productName}</td>
//                 <td>{prod.productCode}</td>
//                 <td>{prod.unit?.unitName || "-"}</td>
//                 <td>{prod.quantity}</td>
//                 <td>{prod.buyingPrice}</td>
//                 <td>{prod.sellingPriceRetail}</td>
//                 <td>{prod.sellingPriceWholesale}</td>
//                 <td>
//                   <button onClick={() => handleEdit(prod)} style={{ marginRight: "0.5rem" }}>
//                     Edit
//                   </button>
//                   <button onClick={() => handleDelete(prod.productId)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default ManageProducts;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { createProduct, getAllProducts, updateProduct, deleteProduct } from "./Service/ProductService";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    productCode: "",
    unitName: "",
    quantity: "",
    buyingPrice: "",
    sellingPriceRetail: "",
    sellingPriceWholesale: "",
  });
  const [editingIdentifier, setEditingIdentifier] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
    loadUnits();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await getAllProducts();
      const data = Array.isArray(response.data) ? response.data : [];
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const loadUnits = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/units");
      setUnits(response.data);
    } catch (error) {
      console.error("Error loading units:", error);
      setError("Failed to load units. Please try again later.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      productName,
      productCode,
      unitName,
      quantity,
      buyingPrice,
      sellingPriceRetail,
      sellingPriceWholesale,
    } = formData;

    setLoading(true);
    setError("");

    try {
      const selectedUnit = units.find((unit) => unit.unitName === unitName);

      if (!selectedUnit) {
        setError("Invalid unit selected");
        return;
      }

      const productData = {
        productName,
        productCode,
        unit: selectedUnit,
        quantity: Number(quantity),
        buyingPrice: Number(buyingPrice),
        sellingPriceRetail: Number(sellingPriceRetail),
        sellingPriceWholesale: Number(sellingPriceWholesale),
      };

      if (editingIdentifier) {
        await updateProduct(editingIdentifier, productData);
        setEditingIdentifier(null);
      } else {
        await createProduct(productData);
      }

      setFormData({
        productName: "",
        productCode: "",
        unitName: "",
        quantity: "",
        buyingPrice: "",
        sellingPriceRetail: "",
        sellingPriceWholesale: "",
      });

      loadProducts();
    } catch (error) {
      console.error("Error submitting product:", error);
      setError("Failed to submit product. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingIdentifier(product.productId);
    setFormData({
      productName: product.productName,
      productCode: product.productCode,
      unitName: product.unit?.unitName || "",
      quantity: product.quantity,
      buyingPrice: product.buyingPrice,
      sellingPriceRetail: product.sellingPriceRetail,
      sellingPriceWholesale: product.sellingPriceWholesale,
    });
  };

  const handleDelete = async (identifier) => {
    setLoading(true);
    setError("");

    try {
      await deleteProduct(identifier);
      loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="product-manager"
      style={{
        maxWidth: '900px',
        margin: '30px auto',
        padding: '20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxShadow: '0 0 15px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        backgroundColor: '#fff',
        position: 'relative',
      }}
    >
      {/* Dashboard Button */}
      <div style={{ position: 'fixed', top: '20px', left: '20px' }}>
        <Link
          to="/dashboard"
          style={{
            textDecoration: 'none',
            color: '#007bff',
            fontSize: '18px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: '600',
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1.5px solid #007bff',
            backgroundColor: '#e7f1ff',
            transition: 'background-color 0.3s, color 0.3s',
          }}
          title="Go to Dashboard"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#007bff';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#e7f1ff';
            e.currentTarget.style.color = '#007bff';
          }}
        >
          <FaHome size={20} />
          Dashboard
        </Link>
      </div>

      <h1 style={{ marginTop: '60px' }}>Manage Products</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={formData.productName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="productCode"
          placeholder="Product Code"
          value={formData.productCode}
          onChange={handleChange}
          required
        />
        <select
          name="unitName"
          value={formData.unitName}
          onChange={handleChange}
          required
        >
          <option value="">Select Unit</option>
          {units.map((unit) => (
            <option key={unit.unitId} value={unit.unitName}>
              {unit.unitName}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="buyingPrice"
          placeholder="Buying Price"
          value={formData.buyingPrice}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="sellingPriceRetail"
          placeholder="Retail Price"
          value={formData.sellingPriceRetail}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="sellingPriceWholesale"
          placeholder="Wholesale Price"
          value={formData.sellingPriceWholesale}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading} style={{ marginTop: "1rem" }}>
          {editingIdentifier ? "Update" : "Add"} Product
        </button>
      </form>

      <h2>Products</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found. Please add a new product.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#eee" }}>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Unit</th>
              <th>Quantity</th>
              <th>Buying Price</th>
              <th>Retail Price</th>
              <th>Wholesale Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.productId}>
                <td>{prod.productName}</td>
                <td>{prod.productCode}</td>
                <td>{prod.unit?.unitName || "-"}</td>
                <td>{prod.quantity}</td>
                <td>{prod.buyingPrice}</td>
                <td>{prod.sellingPriceRetail}</td>
                <td>{prod.sellingPriceWholesale}</td>
                <td>
                  <button onClick={() => handleEdit(prod)} style={{ marginRight: "0.5rem" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(prod.productId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageProducts;
