import { getAuthToken } from './authService';

const API_BASE_URL = 'http://localhost:3001/api';

const getToken = () => localStorage.getItem('token');

// GET kérés
export const get = async (endpoint) => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Hiba történt a kérés során');
  }
  
  return response.json();
};

// POST kérés
export const post = async (endpoint, data) => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Hiba történt a kérés során');
  }
  
  return response.json();
};

// PUT kérés
export const put = async (endpoint, data) => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Hiba történt a kérés során');
  }
  
  return response.json();
};

// DELETE kérés
export const del = async (endpoint) => {
  const token = getAuthToken();
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Hiba történt a kérés során');
  }
  
  return response.json();
};