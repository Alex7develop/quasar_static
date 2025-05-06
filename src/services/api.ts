import axios, { type AxiosInstance, type AxiosError } from 'axios'
import type { DeviceStatistics, DeviceHistory, DeviceConfig } from '../types'
import type {
  StatisticResponse,
  HistoryResponse,
  ApiError as ApiErrorType,
  ConfigUpdatePayload,
} from '../types/api'

const API_BASE_URL = '/api'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(request => {
  console.log('Request:', {
    method: request.method,
    url: request.url,
    headers: request.headers
  });
  return request;
});

apiClient.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  error => {
    const errorInfo = {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    };
    console.error('API Error:', errorInfo);
    
  
    const enhancedError = new Error(
      `API Error: ${errorInfo.message}. Status: ${errorInfo.status}`
    );

    Object.assign(enhancedError, errorInfo);
    
    return Promise.reject(enhancedError);
  }
);

export interface MetricData {
  avg: number
  min: number
  max: number
}

export interface HistoryMetric {
  unix_time: number
  hashrate: MetricData
  inlet_temp_max: MetricData
  outlet_temp_max: MetricData
  power: MetricData
  fan: MetricData
  water_temp: MetricData
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}

export const getStatistics = async (): Promise<StatisticResponse> => {
  try {
    console.log('Fetching statistics from API...')
    const response = await apiClient.get<StatisticResponse>('/statistic');
    return response.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
}

export const getHistory = async (): Promise<HistoryResponse> => {
  try {
    console.log('Fetching history from API...')
    const response = await apiClient.get<HistoryResponse>('/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
}

export const startBlink = async (): Promise<void> => {
  try {
    await apiClient.post('/blink/start');
  } catch (error) {
    console.error('Error starting blink:', error);
    throw error;
  }
}

export const stopBlink = async (): Promise<void> => {
  try {
    await apiClient.post('/blink/stop');
  } catch (error) {
    console.error('Error stopping blink:', error);
    throw error;
  }
}

export const updateConfig = async (config: ConfigUpdatePayload): Promise<void> => {
  try {
    await apiClient.post('/conf', config);
  } catch (error) {
    console.error('Error updating config:', error);
    throw error;
  }
}

export const rebootDevice = async (): Promise<void> => {
  console.warn('rebootDevice API call is not implemented yet');
  try {
    await new Promise(resolve => setTimeout(resolve, 500)); 
  } catch (error) {
    console.error('Error rebooting device:', error);
    throw error;
  }
}

export const startPower = async (id: number): Promise<void> => {
  try {
    await apiClient.post('/power/start', { id });
  } catch (error) {
    console.error('Error starting power:', error);
    throw error;
  }
}

export const stopPower = async (): Promise<void> => {
  try {
    await apiClient.post('/power/stop');
  } catch (error) {
    console.error('Error stopping power:', error);
    throw error;
  }
}

export const switchPower = async (id: number): Promise<void> => {
  try {
    await apiClient.post(`/power/switch/${id}`);
  } catch (error) {
    console.error('Error switching power:', error);
    throw error;
  }
}

export const setPower = async (powerValue: number): Promise<void> => {
  try {
    await startPower(powerValue);
  } catch (error) {
    console.error('Error setting power:', error);
    throw error;
  }
}

export type { DeviceStatistics, DeviceHistory, DeviceConfig }

export default apiClient 

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorType>;
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message;
    }
    return axiosError.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
} 