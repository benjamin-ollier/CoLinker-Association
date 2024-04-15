import api from './axios';

interface LoginCredentials {
  username: string;
  password: string;
}

const login = async (credentials: LoginCredentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      return response.data;
    }
  } catch (error) {
    throw new Error("Login failed");
  }
};

interface RegisterCredentials {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

const register = async (credentials: RegisterCredentials) => {
  try {
    const response = await api.post('/auth/register', credentials);
    if (response.data) {
      return response.data;
    }
  } catch (error) {
    throw new Error("Registration failed");
  }
};

export { login, register };
