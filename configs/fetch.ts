import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import Storage from '@/helpers/storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL;
const TIMEOUT = 10000;

interface BaseQueryProps {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    params?: any;
    config?: any
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
        async (config: InternalAxiosRequestConfig) => {
            if (config.headers) {
                const accessToken = await Storage.getItem("ACCESS_TOKEN")
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

export const baseQuery = async ({ url, method = 'GET', body, params, config = {} }: BaseQueryProps) => {
    try {
        const response = await axiosInstance({
            url,
            method,
            data: body,
            params,
            ...config
        });

        return { data: response };
    } catch (error: any) {
        return {
            error: {
                status: error.response ? error.response.status : 'FETCH_ERROR',
                message: error.response ? error.response.data?.message : error.message,
            },
        };
    }
};

export const refreshAxiosInstance = () => {
    axiosInstance = createAxiosInstance();
};

export default axiosInstance;
