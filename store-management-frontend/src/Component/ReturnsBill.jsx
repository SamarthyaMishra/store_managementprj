import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CreateReturnBill = () => {
  const STORE_INFO = {
    name: "Awasthi Atta Chakki",
    phone: "9876543210",
    gstin: "GSTIN12345XYZ"
  };

  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({ customerName: '', mobileNumber: '', address: '' });

  const [form, setForm] = useState({
    sale: { saleId: "" },
    customer: { customerId: "" },
    returnDate: "",
    returnType: "Retail",
    paymentMode: "Cash",
    returnItems: [],
    totalReturnAmount: 0,
  });

  const [currentItem, setCurrentItem] = useState({
    productId: "",
    quantity: 0,
    price: 0,
    totalPrice: 0,
  });

  const [returnId, setReturnId] = useState(null);

  // Modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8080/api/sales").then(res => setSales(res.data)).catch(() => {});
    axios.get("http://localhost:8080/api/customers").then(res => setCustomers(res.data)).catch(() => {});
    axios.get("http://localhost:8080/api/products").then(res => setProducts(res.data)).catch(() => {});
  }, []);

  const handleCustomerSelect = (e) => {
    if (e.target.value === 'new') {
      setIsNewCustomer(true);
      setForm(prev => ({ ...prev, customer: { customerId: "" } }));
    } else {
      setIsNewCustomer(false);
      setForm(prev => ({ ...prev, customer: { customerId: parseInt(e.target.value) } }));
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    let val = name === "quantity" || name === "price" ? parseFloat(value) : value;
    if (isNaN(val) && (name === "quantity" || name === "price")) val = 0;

    const updatedItem = { ...currentItem, [name]: val };
    updatedItem.totalPrice = updatedItem.quantity * updatedItem.price;
    setCurrentItem(updatedItem);
  };

  const addItem = () => {
    if (!currentItem.productId || currentItem.quantity <= 0 || currentItem.price <= 0) {
      alert("Please select product and enter valid quantity and price.");
      return;
    }

    const selectedProduct = products.find(p => p.productId === parseInt(currentItem.productId));
    if (!selectedProduct) {
      alert("Selected product not found.");
      return;
    }

    const item = {
      product: selectedProduct,
      quantity: currentItem.quantity,
      price: currentItem.price,
      totalPrice: currentItem.totalPrice,
    };

    const updatedItems = [...form.returnItems, item];
    const updatedAmount = updatedItems.reduce((sum, i) => sum + i.totalPrice, 0);

    setForm(prev => ({ ...prev, returnItems: updatedItems, totalReturnAmount: updatedAmount }));
    setCurrentItem({ productId: "", quantity: 0, price: 0, totalPrice: 0 });
  };

  const removeItem = (index) => {
    const updatedItems = form.returnItems.filter((_, i) => i !== index);
    const updatedAmount = updatedItems.reduce((sum, i) => sum + i.totalPrice, 0);
    setForm(prev => ({ ...prev, returnItems: updatedItems, totalReturnAmount: updatedAmount }));
  };

  const handleNewCustomerInput = (e) => {
    const { name, value } = e.target;
    setNewCustomerForm(prev => ({ ...prev, [name]: value }));
  };

  // Open confirmation modal instead of direct submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.sale.saleId) {
      alert("Please select a Sale.");
      return;
    }
    if (!form.customer.customerId && !isNewCustomer) {
      alert("Please select a Customer or add a new one.");
      return;
    }
    if (form.returnItems.length === 0) {
      alert("Please add at least one return item.");
      return;
    }
    if (!form.returnDate) {
      alert("Please select a Return Date.");
      return;
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  // Confirm and send data to backend
  const confirmAndSubmit = async () => {
    try {
      let customerToUse = null;

      if (isNewCustomer) {
        const { customerName, mobileNumber, address } = newCustomerForm;
        if (!customerName || !mobileNumber || !address) {
          alert("Please fill all new customer fields.");
          return;
        }
        const res = await axios.post(
          `http://localhost:8080/api/customers/create/${encodeURIComponent(customerName)}/${mobileNumber}/${encodeURIComponent(address)}`
        );
        customerToUse = res.data;
      } else {
        customerToUse = customers.find(c => c.customerId === form.customer.customerId);
      }

      const payload = {
        sale: { saleId: parseInt(form.sale.saleId) },
        customer: customerToUse,
        returnDate: new Date(form.returnDate).toISOString(),
        returnType: form.returnType,
        paymentMode: form.paymentMode,
        returnItems: form.returnItems,
        totalReturnAmount: form.totalReturnAmount,
      };

      const response = await axios.post('http://localhost:8080/api/returns/create', payload);

      setReturnId(response.data.returnId || null);
      alert("Return Bill Created Successfully!");

      // Reset form after successful submit
      setForm({
        sale: { saleId: "" },
        customer: { customerId: "" },
        returnDate: "",
        returnType: "Retail",
        paymentMode: "Cash",
        returnItems: [],
        totalReturnAmount: 0,
      });
      setNewCustomerForm({ customerName: '', mobileNumber: '', address: '' });
      setIsNewCustomer(false);
      setCurrentItem({ productId: "", quantity: 0, price: 0, totalPrice: 0 });

      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error creating return bill:", error);
      alert("Failed to create return bill.");
      setShowConfirmModal(false);
    }
  };

  // Cancel modal
  const cancelConfirm = () => {
    setShowConfirmModal(false);
  };

  // Helper to display customer info in modal
  const renderCustomerInfo = () => {
    if (isNewCustomer) {
      return (
        <div>
          <p><strong>New Customer Details:</strong></p>
          <p>Name: {newCustomerForm.customerName}</p>
          <p>Mobile: {newCustomerForm.mobileNumber}</p>
          <p>Address: {newCustomerForm.address}</p>
        </div>
      );
    } else {
      const cust = customers.find(c => c.customerId === form.customer.customerId);
      if (!cust) return <p>No customer selected.</p>;
      return (
        <div>
          <p><strong>Selected Customer Details:</strong></p>
          <p>Name: {cust.customerName}</p>
          <p>Mobile: {cust.mobileNumber}</p>
          <p>Address: {cust.address}</p>
        </div>
      );
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', fontFamily: 'Arial, sans-serif', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ margin: '0' }}>{STORE_INFO.name}</h1>
        <p>Phone: {STORE_INFO.phone} | GSTIN: {STORE_INFO.gstin}</p>
        {returnId && <h4>Return Bill ID: {returnId}</h4>}
      </div>

       {/* Dashboard Button */}
      <div style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 1000 }}>
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

      <hr />

      <h2>Create Return Bill</h2>
      <form onSubmit={handleSubmit}>

        <label>Sale:</label>
        <select
          required
          value={form.sale.saleId}
          onChange={(e) => setForm(prev => ({ ...prev, sale: { saleId: e.target.value } }))}
        >
          <option value="">Select Sale</option>
          {sales.map(s => (
            <option key={s.saleId} value={s.saleId}>#{s.saleId}</option>
          ))}
        </select>

        <br /><br />

        <label>Customer:</label>
        <select required onChange={handleCustomerSelect} value={isNewCustomer ? "new" : form.customer.customerId || ""}>
          <option value="">Select Customer</option>
          {customers.map(c => (
            <option key={c.customerId} value={c.customerId}>{c.customerName}</option>
          ))}
          <option value="new">Add New Customer</option>
        </select>

        {isNewCustomer && (
          <div style={{ marginTop: '10px' }}>
            <input
              type="text"
              name="customerName"
              placeholder="Customer Name"
              value={newCustomerForm.customerName}
              onChange={handleNewCustomerInput}
              required
            />
            <input
              type="text"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={newCustomerForm.mobileNumber}
              onChange={handleNewCustomerInput}
              required
              style={{ marginLeft: '10px' }}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={newCustomerForm.address}
              onChange={handleNewCustomerInput}
              required
              style={{ marginLeft: '10px' }}
            />
          </div>
        )}

        <br />

        <label>Return Date:</label>
        <input
          type="date"
          name="returnDate"
          value={form.returnDate}
          onChange={handleFormChange}
          required
        />

        <br /><br />

        <label>Return Type:</label>
        <select name="returnType" value={form.returnType} onChange={handleFormChange}>
          <option value="Retail">Retail</option>
          <option value="Wholesale">Wholesale</option>
        </select>

        <br /><br />

        <label>Payment Mode:</label>
        <select name="paymentMode" value={form.paymentMode} onChange={handleFormChange}>
          <option value="Cash">Cash</option>
          <option value="Credit Card">Credit Card</option>
          <option value="UPI">UPI</option>
        </select>

        <hr />

        <h3>Add Return Item</h3>
        <select
          value={currentItem.productId}
          onChange={e => setCurrentItem(prev => ({ ...prev, productId: parseInt(e.target.value) }))}
        >
          <option value="">Select Product</option>
          {products.map(p => (
            <option key={p.productId} value={p.productId}>{p.productName}</option>
          ))}
        </select>

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={currentItem.quantity}
          onChange={handleItemChange}
          min="0"
          style={{ marginLeft: '10px', width: '80px' }}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={currentItem.price}
          onChange={handleItemChange}
          min="0"
          style={{ marginLeft: '10px', width: '80px' }}
        />

        <button type="button" onClick={addItem} style={{ marginLeft: '10px' }}>Add Item</button>

        <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ borderBottom: '1px solid #ccc' }}>Product</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>Quantity</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>Price</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>Total</th>
              <th style={{ borderBottom: '1px solid #ccc' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {form.returnItems.map((item, idx) => (
              <tr key={idx}>
                <td>{item.product.productName}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.totalPrice.toFixed(2)}</td>
                <td><button type="button" onClick={() => removeItem(idx)}>Remove</button></td>
              </tr>
            ))}
            {form.returnItems.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>No return items added.</td>
              </tr>
            )}
          </tbody>
        </table>

        <h3>Total Return Amount: ₹{form.totalReturnAmount.toFixed(2)}</h3>

        <button type="submit" style={{ marginTop: '20px' }}>Create Return Bill</button>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0,
            width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px',
            boxShadow: '0 0 10px rgba(0,0,0,0.25)'
          }}>
            <h2>Confirm Return Bill</h2>
            {renderCustomerInfo()}

            <p><strong>Return Date:</strong> {form.returnDate}</p>
            <p><strong>Return Type:</strong> {form.returnType}</p>
            <p><strong>Payment Mode:</strong> {form.paymentMode}</p>
            <p><strong>Total Return Amount:</strong> ₹{form.totalReturnAmount.toFixed(2)}</p>

            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <button onClick={cancelConfirm} style={{ marginRight: '10px' }}>Cancel</button>
              <button onClick={confirmAndSubmit}>Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateReturnBill;

