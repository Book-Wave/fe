// services/ShopService.js
import axiosInstance from './AxiosInstance';

// 상점 정보 조회
export const fetchShopInfo = async (shopId) => {
  try {
    const response = await axiosInstance.get(`/shops/${shopId}`);
    return response.data;
  } catch (error) {
    console.error('상점 정보를 불러오지 못했습니다:', error);
    throw error;
  }
};

// 상점의 상품 목록 조회
export const fetchShopItems = async (shopId) => {
  try {
    const response = await axiosInstance.get(`/shops/${shopId}/items`);
    console.log('response : ', response);
    console.log('response data : ', response.data);
    return response.data;
  } catch (error) {
    console.error('상품 목록을 불러오지 못했습니다:', error);
    throw error;
  }
};

// 상점 후기 조회
export const fetchShopReviews = async (shopId) => {
  try {
    const response = await axiosInstance.get(`/shops/${shopId}/reviews`);
    return response.data;
  } catch (error) {
    console.error('상점 후기를 불러오지 못했습니다:', error);
    throw error;
  }
};

// 팔로잉/팔로워 목록 조회
export const fetchFollowList = async (shopId, type) => {
  try {
    const response = await axiosInstance.get(`/shops/${shopId}/${type}`);
    return response.data;
  } catch (error) {
    console.error(`${type} 목록을 불러오지 못했습니다:`, error);
    throw error;
  }
};

// 찜한 상품 목록 조회
export const fetchZzimlist = async (shopId) => {
  try {
    const response = await axiosInstance.get(`/shops/${shopId}/zzim`);
    return response.data;
  } catch (error) {
    console.error('찜한 상품 목록을 불러오지 못했습니다:', error);
    throw error;
  }
};
