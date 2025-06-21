import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

let token = localStorage.getItem('token');

export function setToken(newToken) {
  token = newToken;
  if (newToken) localStorage.setItem('token', newToken);
  else localStorage.removeItem('token');
}

export function getToken() {
  return token;
}

export async function apiFetch(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  const url = `${API_URL}${endpoint}`;
  try {
    const res = await axios({
      url,
      method: options.method || 'get',
      data: options.body ? JSON.parse(options.body) : undefined,
      headers,
      params: options.params,
    });
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || 'API error');
  }
} 