
const BASE_URL = 'http://localhost:5166';
export const loginUser = async (username, password) => {
  const response = await fetch(`${BASE_URL}/api/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });


  if (!response.ok) {
    throw new Error('Giriş başarısız.');
  }


  const data = await response.json();
  localStorage.setItem('token', data.token); // Token'ı localStorage'da sakla
  return data;
};


export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  if (response.status === 401) {
    window.location.href = '/login';
  }

  if (response.status === 403) {
    window.location.href = '/not-authorized';
  }

  if (!response.ok) {
    throw new Error('API hatası');
  }

  return response.json();
};
export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

export const isAuthenticated = () => !!getToken();
