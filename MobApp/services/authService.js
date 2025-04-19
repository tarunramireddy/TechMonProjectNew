import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';


export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    return response.data;
  } catch (error) {
    console.error('Error during signup:', error.response?.data || error.message);
    throw error;
  }
};

export const signin = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, credentials);
    return response.data;
  } catch (error) {
    console.error('Error during signin:', error.response?.data || error.message);
    throw error;
  }
};


export const updateAsset = async (id, assetData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/assets/update/${id}`, assetData);
    return response.data;
  } catch (error) {
    console.error('Error updating asset:', error.response?.data || error.message);
    return { success: false, message: 'Error updating asset', error };
  }
};



export const addAsset = async (assetData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/assets/add`, assetData);
    console.log("💾 Asset saved:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding asset:", error.response?.data || error.message);
    throw error;
  }
};

export const getAssets = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/assets`);
    console.log("🛰️ Raw backend data:", response.data); // debug
    return response.data; // return the array directly
  } catch (error) {
    console.error("Error fetching assets:", error);
    throw error;
  }
};



export const deleteAsset = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/assets/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting asset:", error.response?.data || error);
    throw error;
  }
};

export const getAssetStats = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/assets`);
    const assets = response.data; // Array

    const total = assets.length;
    const available = assets.filter(a => a.status === 'Available').length;
    const assigned = assets.filter(a => a.status === 'Assigned').length;
    const maintenance = assets.filter(a => a.status === 'Maintenance').length;

    return { total, available, assigned, maintenance };
  } catch (err) {
    console.error('Error fetching stats:', err);
    return { total: 0, available: 0, assigned: 0, maintenance: 0 };
  }
};

export const getRecentActivities = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/activities/recent`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recent assets:", error);
    return [];
  }
};








