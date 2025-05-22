
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} from "./Service/ProductService";

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

  // Load all products and units when the component mounts
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

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (either create or update product)
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
    setError(""); // Reset error message

    try {
      // Find the selected unit object based on unitName
      const selectedUnit = units.find((unit) => unit.unitName === unitName);

      if (!selectedUnit) {
        setError("Invalid unit selected");
        return;
      }

      const productData = {
        productName,
        productCode,
        unit: selectedUnit, // Use the full unit object
        quantity: Number(quantity),
        buyingPrice: Number(buyingPrice),
        sellingPriceRetail: Number(sellingPriceRetail),
        sellingPriceWholesale: Number(sellingPriceWholesale),
      };

      if (editingIdentifier) {
        // If editing an existing product
        await updateProduct(editingIdentifier, productData);
        setEditingIdentifier(null);
      } else {
        // If creating a new product
        await createProduct(productData);
      }

      // Reset form after submission
      setFormData({
        productName: "",
        productCode: "",
        unitName: "",
        quantity: "",
        buyingPrice: "",
        sellingPriceRetail: "",
        sellingPriceWholesale: "",
      });

      loadProducts(); // Refresh product list after submission
    } catch (error) {
      console.error("Error submitting product:", error);
      setError("Failed to submit product. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle editing an existing product
  const handleEdit = (product) => {
    setEditingIdentifier(product.productId);
    setFormData({
      productName: product.productName,
      productCode: product.productCode,
      unitName: product.unit?.unitName || "",  // Set the unitName from the selected product
      quantity: product.quantity,
      buyingPrice: product.buyingPrice,
      sellingPriceRetail: product.sellingPriceRetail,
      sellingPriceWholesale: product.sellingPriceWholesale,
    });
  };

  // Handle deleting a product
  const handleDelete = async (identifier) => {
    setLoading(true);
    setError(""); // Reset error message

    try {
      await deleteProduct(identifier);
      loadProducts(); // Refresh product list after deletion
    } catch (error) {
      console.error("Error deleting product:", error);
      setError("Failed to delete product. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Product Manager</h1>

      {/* Display error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
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
        <button type="submit" disabled={loading}>
          {editingIdentifier ? "Update" : "Add"} Product
        </button>
      </form>

      <h2>Products</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found. Please add a new product.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
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
                  <button onClick={() => handleEdit(prod)}>Edit</button>
                  <button onClick={() => handleDelete(prod.productId)}>
                    Delete
                  </button>
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


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   createProduct,
//   getAllProducts,
//   updateProduct,
//   deleteProduct,
// } from "./Service/ProductService";

// const ManageProducts = () => {
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

//   // Load all products and units when the component mounts
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

//   // Handle form input changes
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handle form submission (either create or update product)
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
//     setError(""); // Reset error message

//     try {
//       const selectedUnit = units.find((unit) => unit.unitName === unitName);

//       if (!selectedUnit) {
//         setError("Invalid unit selected");
//         setLoading(false);
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

//   // Handle editing an existing product
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

//   // Handle deleting a product
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
//       <h1>Product Manager</h1>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <form onSubmit={handleSubmit}>
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
//         <button type="submit" disabled={loading}>
//           {editingIdentifier ? "Update" : "Add"} Product
//         </button>
//       </form>

//       <h2>Products</h2>

//       {loading ? (
//         <p>Loading products...</p>
//       ) : products.length === 0 ? (
//         <p>No products found. Please add a new product.</p>
//       ) : (
//         <table border="1" cellPadding="8">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Code</th>
//               <th>Unit</th>
//               <th>Quantity</th>
//               <th>Available Stock</th> {/* New column */}
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
//                 <td>{prod.availableStock !== undefined ? prod.availableStock : "-"}</td> {/* New field */}
//                 <td>{prod.buyingPrice}</td>
//                 <td>{prod.sellingPriceRetail}</td>
//                 <td>{prod.sellingPriceWholesale}</td>
//                 <td>
//                   <button onClick={() => handleEdit(prod)}>Edit</button>
//                   <button onClick={() => handleDelete(prod.productId)}>
//                     Delete
//                   </button>
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
