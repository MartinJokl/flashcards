import axios, { type InternalAxiosRequestConfig } from 'axios';
import { getToken } from './tokenManager';

export const authedAxios = axios.create({
  validateStatus: () => true
});

authedAxios.interceptors.request.use((config: InternalAxiosRequestConfig<unknown>) => {
  const token = getToken();
  config.headers.Authorization = `Bearer ${token}`;
     
  return config;
})

export const normalAxios = axios.create({
  validateStatus: () => true
});