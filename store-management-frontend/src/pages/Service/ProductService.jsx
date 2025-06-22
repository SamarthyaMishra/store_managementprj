// src/api/productApi.js

import axiosInstance from '../../api/axiosInstance';  // ✅ correct // ✅ use instance

export const getAllProducts = () => axiosInstance.get("/api/products");

export const createProduct = (productData) =>
  axiosInstance.post("/api/products/create", productData);

export const updateProduct = (identifier, productData) =>
  axiosInstance.put(`/api/products/product/${identifier}`, productData);

export const deleteProduct = (identifier) =>
  axiosInstance.delete(`/api/products/delete/${identifier}`);
