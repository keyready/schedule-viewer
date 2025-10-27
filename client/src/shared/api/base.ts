import axios from 'axios';

const defaultBaseUrl = typeof window === 'undefined' ? (process.env.NEXT_PUBLIC_API_URL || 'http://server:5000') : '';

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || defaultBaseUrl,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
);
