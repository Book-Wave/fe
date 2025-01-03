import axiosInstance from './AxiosInstance';

const BASE_URL = '/item'; // 공통 API URL의 일부 (axiosInstance의 baseURL에 추가)

export const getItems = async (params) => {
  const response = await axiosInstance.get(`${BASE_URL}/list`, { params });
  return response;
};

export const getPaginatedItems = async (page, size) => {
  const response = await axiosInstance.get(`${BASE_URL}/list/page`, {
    params: { page, size },
  });
  return response;
};

export const getItemDetail = async (itemId) => {
  const response = await axiosInstance.get(`${BASE_URL}/${itemId}`);
  return response;
};

export const registerItem = async (data) => {
  const response = await axiosInstance.post(`${BASE_URL}/register`, data);
  return response;
};

export const updateItem = async (itemId, data) => {
  const response = await axiosInstance.post(`${BASE_URL}/${itemId}/update`, data);
  return response;
};

export const deleteItem = async (itemId) => {
  const response = await axiosInstance.delete(`${BASE_URL}/${itemId}/delete`);
  return response;
};

export const getCategories = async () => {
  const response = await axiosInstance.get(`${BASE_URL}/categories`);
  return response;
};

export const searchBooksFromApi = async (query) => {
  const response = await axiosInstance.get(`${BASE_URL}/search`, {
    params: { query },
  });
  return response;
};
