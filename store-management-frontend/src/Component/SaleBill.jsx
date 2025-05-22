import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import ukFlag from "../assets/flag/eng.png";
import inFlag from "../assets/flag/ind.png";
import './CreateSaleBill.css';

const CreateSaleBill = () => {
  const STORE_INFO = {
    name: "Awasthi Atta Chakki",
    phone: "9876543210",
    gstin: "GSTIN12345XYZ"
  };

  const [billItems, setBillItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedSaleType, setSelectedSaleType] = useState("Retail");
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [form, setForm] = useState({ customerName: '', mobileNumber: '', address: '' });
  const [saleId, setSaleId] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [saleDetails, setSaleDetails] = useState(null);

  const [bill, setBill] = useState({
    customer: null,
    paymentMode: 'Cash',
    type: 'Retail',
    grossTotal: 0,
    items: []
  });
 const languages = [
    { code: "en", label: "English", flag: ukFlag },
    { code: "hi", label: "हिंदी", flag: inFlag },
  ];

 
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
    axios.get('http://localhost:8080/api/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const fetchCustomers = () => {
    axios.get('http://localhost:8080/api/customers')
      .then(res => setCustomers(res.data))
      .catch(err => console.error('Error fetching customers:', err));
  };

  const handleCustomerSelect = (e) => {
    if (e.target.value === 'new') {
      setIsNewCustomer(true);
      setBill(prev => ({ ...prev, customer: null }));
    } else {
      const selectedCustomer = customers.find(c => c.customerId === parseInt(e.target.value));
      setBill(prev => ({ ...prev, customer: selectedCustomer }));
      setIsNewCustomer(false);
    }
  };

const handleProductChange = (index, selectedProductName) => {
  const updatedItems = [...billItems];
  const selectedProduct = allProducts.find(p => p.name === selectedProductName);

  if (selectedProduct) {
    const existingPrice = updatedItems[index].price;
    const isRetail = selectedSaleType === 'Retail'; // or selectedReturnType if this is Return page

    const dbPrice = isRetail ? selectedProduct.retailPrice : selectedProduct.wholesalePrice;

    const finalPrice = !existingPrice || existingPrice === 0 ? dbPrice : existingPrice;

    updatedItems[index] = {
      ...updatedItems[index],
      productName: selectedProductName,
      productId: selectedProduct.id,
      unit: selectedProduct.unit,
      price: finalPrice,
    };
    setBillItems(updatedItems);
  }
};

  const handleProductSelect = (index, productId) => {
    const selectedProduct = products.find(p => p.productId === parseInt(productId));
    const updatedItems = [...bill.items];
    updatedItems[index].product = selectedProduct;
    setBill(prev => ({ ...prev, items: updatedItems }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...bill.items];
    updatedItems[index][field] = parseFloat(value);
    const price = updatedItems[index].price || 0;
    const quantity = updatedItems[index].quantity || 0;
    updatedItems[index].totalPrice = price * quantity;
    const grossTotal = updatedItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    setBill(prev => ({ ...prev, items: updatedItems, grossTotal }));
  };

  const addItem = () => {
    setBill(prev => ({
      ...prev,
      items: [...prev.items, { product: null, quantity: 1, price: 0, totalPrice: 0 }]
    }));
  };

  const removeItem = (index) => {
    const newItems = bill.items.filter((_, i) => i !== index);
    const grossTotal = newItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    setBill(prev => ({ ...prev, items: newItems, grossTotal }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (bill.items.length === 0) {
      alert("Please add at least one item.");
      return;
    }

    try {
      let customerToUse = bill.customer;

      if (isNewCustomer) {
        const { customerName, mobileNumber, address } = form;
        if (!customerName || !mobileNumber || !address) {
          alert("Please fill out all customer fields.");
          return;
        }

        const customerRes = await axios.post(
          `http://localhost:8080/api/customers/create/${encodeURIComponent(customerName)}/${mobileNumber}/${encodeURIComponent(address)}`
        );
        customerToUse = customerRes.data;
      }

      const dto = {
        customer: customerToUse,
        paymentMode: bill.paymentMode,
        saleType: bill.type,
        grossTotal: bill.grossTotal,
        items: bill.items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.totalPrice
        }))
      };

      const response = await axios.post('http://localhost:8080/api/sales/create', dto);
      setSaleId(response.data.saleId || null);
      setSaleDetails(response.data);
      setPopupVisible(true);
    } catch (err) {
      console.error('Error creating sale:', err);
      alert('Failed to create sale. Check backend.');
    }
  };

  const closePopup = () => {
 
  };

  return (
    <div className="create-sale-container">
      <div style={{ textAlign: 'center' }}>
        <h1>{STORE_INFO.name}</h1>
        <p>Phone: {STORE_INFO.phone} | GSTIN: {STORE_INFO.gstin}</p>
        {saleId && <h4>Sale ID: {saleId}</h4>}
      </div>

      <hr />

      <h2>Create Sale Bill</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Customer Details</legend>
          <label>Existing Customer: </label>
          <select onChange={handleCustomerSelect} required>
            <option value="">--Select--</option>
            {customers.map(c => (
              <option key={c.customerId} value={c.customerId}>
                {c.customerName} ({c.mobileNumber})
              </option>
            ))}
            <option value="new">Add New Customer</option>
          </select>

          {isNewCustomer && (
            <div className="new-customer-fields">
              <input placeholder="Name" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} required />
              <input placeholder="Mobile" value={form.mobileNumber} onChange={e => setForm({ ...form, mobileNumber: e.target.value })} required />
              <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
            </div>
          )}
        </fieldset>

        <fieldset>
          <legend>Bill Info</legend>
          <label>Type: </label>
          <select value={bill.type} onChange={e => setBill(prev => ({ ...prev, type: e.target.value }))}>
            <option value="Retail">Retail</option>
            <option value="Wholesale">Wholesale</option>
          </select>
          <label style={{ marginLeft: '20px' }}>Payment: </label>
          <select value={bill.paymentMode} onChange={e => setBill(prev => ({ ...prev, paymentMode: e.target.value }))}>
            <option value="Cash">Cash</option>
            <option value="Online">Online</option>
          </select>
        </fieldset>

        <fieldset>
          <legend>Items</legend>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
  <thead>
    <tr>
      <th style={{ border: '1px solid black', padding: '8px' }}>Product</th>
      <th style={{ border: '1px solid black', padding: '8px' }}>Qty</th>
      <th style={{ border: '1px solid black', padding: '8px' }}>Price</th>
      <th style={{ border: '1px solid black', padding: '8px' }}>Total</th>
      <th style={{ border: '1px solid black', padding: '8px' }}>Action</th>
    </tr>
  </thead>
  <tbody>
    {bill.items.map((item, index) => (
      <tr key={index}>
        {/* <td style={{ border: '1px solid black', padding: '8px' }}>
          <select onChange={e => handleProductSelect(index, e.target.value)} required>
            <option value="">Select</option>
            {products.map(p => (
              <option key={p.productId} value={p.productId}>
                {p.productName}
              </option>
            ))}
          </select>
        </td> */}
        <td>
      {/* PRODUCT NAME SELECT DROPDOWN */}
      <select
        value={item.productName}
        onChange={(e) => handleProductChange(index, e.target.value)}
      >
        <option value="">Select Product</option>
        {products.map(product => (
          <option key={product.productId} value={product.productName}>
            {product.productName}
          </option>
        ))}
      </select>
    </td>
        <td style={{ border: '1px solid black', padding: '8px' }}>
          <input
            type="number"
            value={item.quantity}
            onChange={e => handleItemChange(index, 'quantity', e.target.value)}
            required
            style={{ width: '60px' }}
          />
        </td>
        <td style={{ border: '1px solid black', padding: '8px' }}>
          <input
            type="number"
            value={item.price}
            onChange={e => handleItemChange(index, 'price', e.target.value)}
            required
            style={{ width: '80px' }}
          />
        </td>
        <td style={{ border: '1px solid black', padding: '8px' }}>
          ₹{item.totalPrice.toFixed(2)}
        </td>
        <td style={{ border: '1px solid black', padding: '8px', textAlign: 'center' }}>
          <button type="button" onClick={() => removeItem(index)}>❌</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>
          <button type="button" onClick={addItem}>+ Add Item</button>
        </fieldset>

        <h3 style={{ textAlign: 'right' }}>Gross Total: ₹{bill.grossTotal.toFixed(2)}</h3>
        <div style={{ textAlign: 'center' }}>
          <button type="submit">🧾 Create Sale Bill</button>
        </div>
      </form>

      {/* Popup Modal for Invoice */}
      {popupVisible && saleDetails && (
  <div className="print-modal">
    <div className="print-page" id="print-area">
      <h1 style={{ textAlign: 'center' }}>{STORE_INFO.name}</h1>
      <p style={{ textAlign: 'center' }}>
        Phone: {STORE_INFO.phone} | GSTIN: {STORE_INFO.gstin}
      </p>
      <hr />
      <h2>Invoice</h2>
      <p><strong>Sale ID:</strong> {saleDetails.saleId}</p>
      <p><strong>Customer:</strong> {saleDetails.customer.customerName}</p>
      <p><strong>Mobile:</strong> {saleDetails.customer.mobileNumber}</p>
      <p><strong>Address:</strong> {saleDetails.customer.address}</p>
      <hr />
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Product</th>
            <th >Qty</th>
            <th >Price</th>
            <th >Total</th>
          </tr>
        </thead>
        <tbody>
          {saleDetails.items.map((item, idx) => (
            <tr key={idx}>
              <td style={{ border: '1px solid black' }}>{item.product.productName}</td>
              <td style={{ border: '1px solid black' }}>{item.quantity}</td>
              <td style={{ border: '1px solid black' }}>₹{item.price}</td>
              <td style={{ border: '1px solid black' }}>₹{item.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 style={{ textAlign: 'right' }}>Gross Total: ₹{saleDetails.grossTotal}</h3>

      <div className="no-print" style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={handlePrint} style={{ marginRight: '10px' }}>🖨️ Print</button>

        <a
          href={`https://wa.me/91${saleDetails.customer.mobileNumber}?text=${encodeURIComponent(
            `Hello ${saleDetails.customer.customerName}, your invoice from ${STORE_INFO.name} (Sale ID: ${saleDetails.saleId}) is ready. Gross Total: ₹${saleDetails.grossTotal}. Thank you!`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginRight: '10px' }}
        >
          <img
            src="https://img.icons8.com/color/48/000000/whatsapp--v1.png"
            alt="Send on WhatsApp"
            style={{ width: '40px', verticalAlign: 'middle' }}
          />
        </a>

        <button onClick={closePopup}>Close</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default CreateSaleBill;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// import ukFlag from "../assets/flag/eng.png";
// import inFlag from "../assets/flag/ind.png";
// import './CreateSaleBill.css';

// const CreateSaleBill = () => {
//   const STORE_INFO = {
//     name: "Awasthi Atta Chakki",
//     phone: "9876543210",
//     gstin: "GSTIN12345XYZ"
//   };

//   const [allProducts, setAllProducts] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [isNewCustomer, setIsNewCustomer] = useState(false);
//   const [form, setForm] = useState({ customerName: '', mobileNumber: '', address: '' });
//   const [saleId, setSaleId] = useState(null);
//   const [popupVisible, setPopupVisible] = useState(false);
//   const [saleDetails, setSaleDetails] = useState(null);

//   const [bill, setBill] = useState({
//     customer: null,
//     paymentMode: 'Cash',
//     type: 'Retail',
//     grossTotal: 0,
//     items: [{ product: null, productName: '', quantity: 1, price: 0, totalPrice: 0 }]
//   });

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCustomers();
//     axios.get('http://localhost:8080/api/products')
//       .then(res => {
//         setAllProducts(res.data);
//       })
//       .catch(err => console.error('Error fetching products:', err));
//   }, []);

//   const fetchCustomers = () => {
//     axios.get('http://localhost:8080/api/customers')
//       .then(res => setCustomers(res.data))
//       .catch(err => console.error('Error fetching customers:', err));
//   };

//   const handleCustomerSelect = (e) => {
//     if (e.target.value === 'new') {
//       setIsNewCustomer(true);
//       setBill(prev => ({ ...prev, customer: null }));
//     } else {
//       const selectedCustomer = customers.find(c => c.customerId === parseInt(e.target.value));
//       setBill(prev => ({ ...prev, customer: selectedCustomer }));
//       setIsNewCustomer(false);
//     }
//   };

//   const handleProductChange = (index, selectedProductName) => {
//     const updatedItems = [...bill.items];
//     const selectedProduct = allProducts.find(p => p.productName === selectedProductName);

//     if (selectedProduct) {
//       const isRetail = bill.type === 'Retail';
//       const dbPrice = isRetail ? selectedProduct.retailPrice : selectedProduct.wholesalePrice;
//       const existingPrice = updatedItems[index].price;
//       const finalPrice = (!existingPrice || existingPrice === 0) ? dbPrice : existingPrice;

//       updatedItems[index] = {
//         ...updatedItems[index],
//         productName: selectedProductName,
//         product: selectedProduct,
//         price: finalPrice,
//       };

//       // Recalculate totalPrice for the item
//       const quantity = updatedItems[index].quantity || 0;
//       updatedItems[index].totalPrice = finalPrice * quantity;

//       // Recalculate grossTotal
//       const grossTotal = updatedItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

//       setBill(prev => ({ ...prev, items: updatedItems, grossTotal }));
//     }
//   };

//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...bill.items];
//     let parsedValue = field === 'quantity' || field === 'price' ? parseFloat(value) : value;
//     if (isNaN(parsedValue)) parsedValue = 0;

//     updatedItems[index][field] = parsedValue;

//     const price = updatedItems[index].price || 0;
//     const quantity = updatedItems[index].quantity || 0;
//     updatedItems[index].totalPrice = price * quantity;

//     const grossTotal = updatedItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);

//     setBill(prev => ({ ...prev, items: updatedItems, grossTotal }));
//   };

//   const addItem = () => {
//     setBill(prev => ({
//       ...prev,
//       items: [...prev.items, { product: null, productName: '', quantity: 1, price: 0, totalPrice: 0 }]
//     }));
//   };

//   const removeItem = (index) => {
//     const newItems = bill.items.filter((_, i) => i !== index);
//     const grossTotal = newItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
//     setBill(prev => ({ ...prev, items: newItems, grossTotal }));
//   };

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (bill.items.length === 0) {
//       alert("Please add at least one item.");
//       return;
//     }

//     try {
//       let customerToUse = bill.customer;

//       if (isNewCustomer) {
//         const { customerName, mobileNumber, address } = form;
//         if (!customerName || !mobileNumber || !address) {
//           alert("Please fill out all customer fields.");
//           return;
//         }

//         const customerRes = await axios.post(
//           `http://localhost:8080/api/customers/create/${encodeURIComponent(customerName)}/${mobileNumber}/${encodeURIComponent(address)}`
//         );
//         customerToUse = customerRes.data;
//       }

//       const dto = {
//         customer: customerToUse,
//         paymentMode: bill.paymentMode,
//         saleType: bill.type,
//         grossTotal: bill.grossTotal,
//         items: bill.items.map(item => ({
//           product: item.product,
//           quantity: item.quantity,
//           price: item.price,
//           totalPrice: item.totalPrice
//         }))
//       };

//       const response = await axios.post('http://localhost:8080/api/sales/create', dto);
//       setSaleId(response.data.saleId || null);
//       setSaleDetails(response.data);
//       setPopupVisible(true);
//     } catch (err) {
//       console.error('Error creating sale:', err);
//       alert('Failed to create sale. Check backend.');
//     }
//   };

//   const closePopup = () => {
//     setPopupVisible(false);
//     setSaleId(null);
//     setSaleDetails(null);
//   };

//   return (
//     <div className="create-sale-container">
//       <div style={{ textAlign: 'center' }}>
//         <h1>{STORE_INFO.name}</h1>
//         <p>Phone: {STORE_INFO.phone} | GSTIN: {STORE_INFO.gstin}</p>
//         {saleId && <h4>Sale ID: {saleId}</h4>}
//       </div>

//       <hr />

//       <h2>Create Sale Bill</h2>
//       <form onSubmit={handleSubmit}>
//         <fieldset>
//           <legend>Customer Details</legend>
//           <label>Existing Customer: </label>
//           <select onChange={handleCustomerSelect} required>
//             <option value="">--Select--</option>
//             {customers.map(c => (
//               <option key={c.customerId} value={c.customerId}>
//                 {c.customerName} ({c.mobileNumber})
//               </option>
//             ))}
//             <option value="new">Add New Customer</option>
//           </select>

//           {isNewCustomer && (
//             <div className="new-customer-fields">
//               <input placeholder="Name" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} required />
//               <input placeholder="Mobile" value={form.mobileNumber} onChange={e => setForm({ ...form, mobileNumber: e.target.value })} required />
//               <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
//             </div>
//           )}
//         </fieldset>

//         <fieldset>
//           <legend>Bill Info</legend>
//           <label>Type: </label>
//           <select value={bill.type} onChange={e => setBill(prev => ({ ...prev, type: e.target.value }))}>
//             <option value="Retail">Retail</option>
//             <option value="Wholesale">Wholesale</option>
//           </select>
//           <label style={{ marginLeft: '20px' }}>Payment: </label>
//           <select value={bill.paymentMode} onChange={e => setBill(prev => ({ ...prev, paymentMode: e.target.value }))}>
//             <option value="Cash">Cash</option>
//             <option value="Online">Online</option>
//           </select>
//         </fieldset>

//         <fieldset>
//           <legend>Items</legend>
//           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//             <thead>
//               <tr>
//                 <th style={{ border: '1px solid black', padding: '8px' }}>Product</th>
//                 <th style={{ border: '1px solid black', padding: '8px' }}>Qty</th>
//                 <th style={{ border: '1px solid black', padding: '8px' }}>Price</th>
//                 <th style={{ border: '1px solid black', padding: '8px' }}>Total</th>
//                 <th style={{ border: '1px solid black', padding: '8px' }}>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {bill.items.map((item, index) => (
//                 <tr key={index}>
//                   <td style={{ border: '1px solid black', padding: '8px' }}>
//                     <select
//                       value={item.productName}
//                       onChange={e => handleProductChange(index, e.target.value)}
//                       required
//                     >
//                       <option value="">--Select Product--</option>
//                       {allProducts.map(p => (
//                         <option key={p.productId} value={p.productName}>{p.productName}</option>
//                       ))}
//                     </select>
//                   </td>
//                   <td style={{ border: '1px solid black', padding: '8px' }}>
//                     <input
//                       type="number"
//                       min="1"
//                       value={item.quantity}
//                       onChange={e => handleItemChange(index, 'quantity', e.target.value)}
//                       required
//                     />
//                   </td>
//                   <td style={{ border: '1px solid black', padding: '8px' }}>
//                     <input
//                       type="number"
//                       min="0"
//                       value={item.price}
//                       onChange={e => handleItemChange(index, 'price', e.target.value)}
//                       required
//                     />
//                   </td>
//                   <td style={{ border: '1px solid black', padding: '8px' }}>{item.totalPrice.toFixed(2)}</td>
//                   <td style={{ border: '1px solid black', padding: '8px' }}>
//                     {bill.items.length > 1 && <button type="button" onClick={() => removeItem(index)}>Remove</button>}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           <button type="button" onClick={addItem}>Add Item</button>
//         </fieldset>

//         <h3>Total: ₹{bill.grossTotal.toFixed(2)}</h3>

//         <button type="submit">Submit</button>
//         <button type="button" onClick={handlePrint}>Print Bill</button>
//       </form>

//       {popupVisible && saleDetails && (
//         <div className="popup">
//           <h3>Sale Created Successfully!</h3>
//           <p>Sale ID: {saleId}</p>
//           <p>Customer: {saleDetails.customer.customerName}</p>
//           <p>Gross Total: ₹{saleDetails.grossTotal.toFixed(2)}</p>
//           <button onClick={closePopup}>Close</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CreateSaleBill;
