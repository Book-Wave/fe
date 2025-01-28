// services/ShopService.js
import axiosInstance from './AxiosInstance';

// 상점 정보 조회
export const fetchShopInfo = async (shopId) => {
  try {
    const response = await axiosInstance.get(`/shop/${shopId}`);
    return response.data;
  } catch (error) {
    console.error('상점 정보를 불러오지 못했습니다:', error);
    throw error;
  }
};

// 상점의 상품 목록 조회
export const fetchShopItems = async (shopId) => {
  try {
    const response = await axiosInstance.get(`/shop/${shopId}/items`);
    return response.data;
  } catch (error) {
    console.error('상품 목록을 불러오지 못했습니다:', error);
    throw error;
  }
};

// 상점 후기 조회
export const fetchShopReviews = async (shopId) => {
  try {
    const response = await axiosInstance.get(`/shop/${shopId}/reviews`);
    return response.data;
  } catch (error) {
    console.error('상점 후기를 불러오지 못했습니다:', error);
    throw error;
  }
};

// 찜 목록 조회
export const fetchZzimlist = async (shopId) => {
  try {
    const response = await axiosInstance.get(`/shop/${shopId}/zzim`);
    return response.data;
  } catch (error) {
    console.error('찜 목록을 불러오지 못했습니다:', error);
    throw error;
  }
};

// 상품 삭제
export const deleteItem = async (itemId) => {
  try {
    await axiosInstance.delete(`/items/${itemId}`);
  } catch (error) {
    console.error('상품 삭제에 실패했습니다:', error);
    throw error;
  }
};

// 상품 수정
export const updateItem = async (itemId, itemData) => {
  try {
    const response = await axiosInstance.put(`/items/${itemId}`, itemData);
    return response.data;
  } catch (error) {
    console.error('상품 수정에 실패했습니다:', error);
    throw error;
  }
};

// 상품 상태 변경
export const updateItemStatus = async (itemId, status) => {
  try {
    const response = await axiosInstance.patch(`/item/${itemId}/status`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error('상품 상태 변경에 실패했습니다:', error);
    throw error;
  }
};

// 상품 일괄 삭제
export const deleteItems = async (itemIds) => {
  try {
    await axiosInstance.delete('/item/delete', { data: { itemIds } });
  } catch (error) {
    console.error('상품 일괄 삭제에 실패했습니다:', error);
    throw error;
  }
};

// 상점의 상품 목록 페이지네이션 조회
export const fetchShopItemsWithPagination = async (shopId, page, size) => {
  try {
    const response = await axiosInstance.get(`/shop/${shopId}/items`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error('상품 목록을 불러오지 못했습니다:', error);
    throw error;
  }
};
