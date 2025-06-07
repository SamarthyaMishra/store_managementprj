import axios from "axios";

const BASE_URL = "http://localhost:8080/api/products";

export const getAllProducts = () => axios.get(BASE_URL);

export const createProduct = (productData) => {
  return axios.post(`${BASE_URL}/create`, productData);
};


export const updateProduct = (identifier, productData) => {
    return axios.put(`${BASE_URL}/product/${identifier}`, productData);
  };  

export const deleteProduct = (identifier) => {
  return axios.delete(`${BASE_URL}/delete/${identifier}`);
};
