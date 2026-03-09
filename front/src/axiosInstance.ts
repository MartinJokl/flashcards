import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { getToken } from './tokenManager';

export const authedAxios: AxiosInstance = axios.create({
  validateStatus: () => true
});

authedAxios.interceptors.request.use((config: InternalAxiosRequestConfig<unknown>) => {
  const token: string | null = getToken();
  config.headers.Authorization = `Bearer ${token}`;
     
  return config;
})

export const normalAxios: AxiosInstance = axios.create({
  validateStatus: () => true
});