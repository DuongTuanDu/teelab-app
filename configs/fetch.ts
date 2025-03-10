import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const TIMEOUT = 10000;

interface BaseQueryProps {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    data?: any;
    params?: any;
}

const createAxiosInstance = (): AxiosInstance => {
    const instance = axios.create({
        baseURL: API_URL,
        timeout: TIMEOUT,
        headers: {
            Accept: 'application/json',
        },
    });

    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            if (config.headers) {
                const accessToken = AsyncStorage.getItem("ACCESS_TOKEN")
                if (accessToken) {
                    config.headers['X-Customer-Header'] = `Bearer ${accessToken}`;
                }
            }
            return config;
        },
        (error: AxiosError) => {
            return Promise.reject(error);
        }
    )

    instance.interceptors.response.use(
        (response: AxiosResponse) => response.data,
        (error: AxiosError) => {
            if (error.response) {
                console.error('Response error:', error.response.status, error.response.data);
            } else if (error.request) {
                console.error('Request error:', error.request);
            } else {
                console.error('Error:', error.message);
            }
            return Promise.reject(error);
        }
    );

    return instance;
};

let axiosInstance = createAxiosInstance();

export const baseQuery = async ({ url, method = 'GET', data, params }: BaseQueryProps) => {
    try {
        const response = await axiosInstance({
            url,
            method,
            data,
            params,
        });

        return { data: response };
    } catch (error: any) {
        return {
            error: {
                status: error.response ? error.response.status : 'FETCH_ERROR',
                message: error.response ? error.response.data : error.message,
            },
        };
    }
};

export const refreshAxiosInstance = () => {
    axiosInstance = createAxiosInstance();
};

export default axiosInstance;
