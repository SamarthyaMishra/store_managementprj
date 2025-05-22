import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CustomerManager = () => {
  const [customers, setCustomers] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [foundCustomer, setFoundCustomer] = useState(null);
  const [form, setForm] = useState({
    customerName: '',
    mobileNumber: '',
    address: '',
  });

  const fetchCustomers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/customers');
      setCustomers(res.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    try {
      const res = await axios.get(`http://localhost:8080/api/customers/${searchInput}`);
      setFoundCustomer(res.data);
      setForm({
        customerName: res.data.customerName || '',
        mobileNumber: res.data.mobileNumber || '',
        address: res.data.address || '',
      });
    } catch (error) {
      setFoundCustomer(null);
      alert('Customer not found');
    }
  };

  const handleCreateCustomer = async () => {
    const { customerName, mobileNumber, address } = form;
    if (!customerName || !mobileNumber || !address) {
      alert('Please fill out all fields');
      return;
    }

    try {
      await axios.post(
        `http://localhost:8080/api/customers/create/${encodeURIComponent(customerName)}/${mobileNumber}/${encodeURIComponent(address)}`
      );
      alert('Customer created successfully!');
      setForm({ customerName: '', mobileNumber: '', address: '' });
      fetchCustomers();
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('Error creating customer');
    }
  };

  const handleUpdate = async () => {
    if (!searchInput) {
      alert('Please search a customer to update.');
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/customers/${searchInput}`, form);
      alert('Customer updated successfully!');
      setFoundCustomer(null);
      setForm({ customerName: '', mobileNumber: '', address: '' });
      fetchCustomers();
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Error updating customer');
    }
  };

  const handleDelete = async () => {
    if (!searchInput) {
      alert('Please search a customer to delete.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    try {
      await axios.delete(`http://localhost:8080/api/customers/${searchInput}`);
      alert('Customer deleted successfully!');
      setFoundCustomer(null);
      setForm({ customerName: '', mobileNumber: '', address: '' });
      setSearchInput('');
      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Error deleting customer');
    }
  };

  return (
    <div className="customer-manager" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>Customer Manager</h2>

      {/* Search Section */}
      <div>
        <h4>Search Customer by Name or Mobile</h4>
        <input
          type="text"
          placeholder="Enter name or mobile number"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Show Found Customer */}
      {foundCustomer && (
        <div style={{ marginTop: '10px' }}>
          <strong>Customer Found:</strong>
          <p>Name: {foundCustomer.customerName}</p>
          <p>Mobile: {foundCustomer.mobileNumber}</p>
          <p>Address: {foundCustomer.address}</p>
        </div>
      )}

      <hr />

      {/* Create or Update Section */}
      <div>
        <h4>Create / Update Customer</h4>
        <input
          type="text"
          placeholder="Customer Name"
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={form.mobileNumber}
          onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
        />
        <input
          type="text"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <div style={{ marginTop: '10px' }}>
          <button onClick={handleCreateCustomer}>Create</button>
          <button onClick={handleUpdate}>Update</button>
          <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>Delete</button>
        </div>
      </div>

      <hr />

      {/* Customer List */}
      <div>
        <h4>All Customers</h4>
        <ul>
          {customers.map((c) => (
            <li key={c.customerId}>
              <strong>{c.customerName}</strong> - {c.mobileNumber} - {c.address}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomerManager;
