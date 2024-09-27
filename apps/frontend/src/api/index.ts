import axios from 'axios';
import Cookies from 'js-cookie';

const useAxios = () => {

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      accept: 'application/json',
    },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = Cookies.get('auth-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        Cookies.remove('auth-token');
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;
