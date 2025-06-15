import React, { useState, useEffect } from "react";
import axios from "axios";
import { createProduct, getAllProducts, updateProduct, deleteProduct } from "./Service/ProductService";
import { Link } from "react-router-dom";
import ukFlag from '../assets/flag/eng.png';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import inFlag from '../assets/flag/ind.png';
import { FaHome } from "react-icons/fa";

const ManageProducts = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', flag: ukFlag },
    { code: 'hi', label: 'हिंदी', flag: inFlag },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

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
        setEditingIdentifier(null); // ✅ Clear editing mode
      } else {
        await createProduct(productData);
      }

      // ✅ Reset form after submit
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

      {/* Language Dropdown */}{/* Language Dropdown */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: 'white',
            padding: '5px 10px',
            borderRadius: 4,
            boxShadow: '0 0 5px rgba(0,0,0,0.2)',
          }}
        >
          <img
            src={currentLanguage.flag}
            alt={currentLanguage.label}
            style={{ width: 20, marginRight: 8 }}
          />
          <span>{currentLanguage.label}</span>
        </div>

        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: 4,
              marginTop: 4,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              minWidth: 130,
              zIndex: 2000,
            }}
          >
            {languages.map((lang) => (
              <div
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                style={{
                  padding: '5px 10px',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  backgroundColor: lang.code === currentLanguage.code ? '#eee' : 'white',
                }}
              >
                <img
                  src={lang.flag}
                  alt={lang.label}
                  style={{ width: 20, marginRight: 8 }}
                />
                <span>{lang.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <h1 style={{ marginTop: '60px' }}>{t('manage_products')}</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead style={{ backgroundColor: "#add8e6" }}>
            <tr>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>{t('product_name')}</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>{t('product_code')}</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>{t('unit')}</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>{t('quantity')}</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>{t('buyingPrice')}</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>{t('retailPrice')}</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>{t('wholesalePrice')}</th>
              <th style={{ padding: "10px", border: "1px solid #ccc" }}>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                  placeholder="Product Name"
                />
              </td>
              <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                <input
                  type="text"
                  name="productCode"
                  value={formData.productCode}
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                  placeholder="Product Code"
                />
              </td>
              <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                <select
                  name="unitName"
                  value={formData.unitName}
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                >
                  <option value="">{t('select_unit')}</option>
                  {units.map((unit) => (
                    <option key={unit.unitId} value={unit.unitName}>
                      {unit.unitName}
                    </option>
                  ))}
                </select>
              </td>
              <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                  placeholder="Quantity"
                />
              </td>
              <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                <input
                  type="number"
                  name="buyingPrice"
                  value={formData.buyingPrice}
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                  placeholder="Buying Price"
                />
              </td>
              <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                <input
                  type="number"
                  name="sellingPriceRetail"
                  value={formData.sellingPriceRetail}
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                  placeholder="Retail Price"
                />
              </td>
              <td style={{ padding: "10px", border: "1px solid #ccc" }}>
                <input
                  type="number"
                  name="sellingPriceWholesale"
                  value={formData.sellingPriceWholesale}
                  onChange={handleChange}
                  required
                  style={{ width: "100%" }}
                  placeholder="Wholesale Price"
                />
              </td>
              <td style={{ padding: "10px", border: "1px solid #ccc", textAlign: "center" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{ padding: "6px 12px" }}
                >
                  {editingIdentifier ? "Update" : "Add"}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>



      <h2>{t('products')}</h2>

      {loading ? (
        <p>{t('loading_products')}</p>
      ) : products.length === 0 ? (
        <p>{t('no_products_found')}</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#add8e6" }}>
            <tr>
              <th>{t('product_name')}</th>
              <th>{t('product_code')}</th>
              <th>{t('unit')}</th>
              <th>{t('quantity')}</th>
              <th>{t('buying_price')}</th>
              <th>{t('retail_price')}</th>
              <th>{t('wholesale_price')}</th>
              <th>{t('actions')}</th>
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
                  <button
                    onClick={() => handleEdit(prod)}
                    style={{
                      marginRight: "0.5rem",
                      backgroundColor: "#add8e6", // Light Blue
                      color: "#000",              // Black text for contrast
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    {t('edit')}
                  </button>
                  <button onClick={() => handleDelete(prod.productId)}>{t('delete')}</button>
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
