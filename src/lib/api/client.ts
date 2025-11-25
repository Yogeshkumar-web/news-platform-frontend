import { ApiResponse, ValidationError } from "@/types";
import axios, { type AxiosResponse, isAxiosError } from "axios";

// NOTE: Aapko yeh types aapki file mein define/import karne honge
// import type { ApiResponse, ValidationError } from "@/types";

// --- Configuration ---

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BACKEND_API_URL ||
    "http://localhost:5000";

if (!API_BASE_URL) {
    throw new Error("CRITICAL: API Base URL is not configured");
}

// --- Custom Error Handling ---

/**
 * Custom error interface for structured error data.
 * @description Hum AxiosError ko extend nahi kar rahe, balki ek naya custom type bana rahe hain.
 */
export interface CustomAxiosError extends Error {
    status?: number; 
    code?: string;
    data?: unknown;
    errors?: ValidationError[];
}

// --- Axios Instance ---

/**
 * Axios instance for client-side API calls
 */
export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Cookie-based auth ke liye
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// --- Interceptors ---

/**
 * Request Interceptor (JWT/Headers/Logging)
 */
axiosInstance.interceptors.request.use(
    // type AxioxRequestConfig ka use, InternalAxiosRequestConfig ki jagah
    (config) => {
        if (process.env.NODE_ENV === "development") {
            console.log(
                `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
                config.data ? "with data" : ""
            );
        }
        return config;
    },
    (error) => {
        if (process.env.NODE_ENV === "development") {
            console.error("[API Request Error]", error);
        }
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor (Error Transformation and Logging)
 */
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        if (process.env.NODE_ENV === "development") {
            console.log(
                `[API Response] ${response.status} ${response.config.url}`
            );
        }
        return response;
    },
    (error) => {
        // AxiosError ko import karne ki jagah isAxiosError se check kar rahe hain
        if (!isAxiosError(error)) {
            // Non-Axios errors (jaise code error)
            return Promise.reject(error);
        }

        // Agar error Axios se aaya hai
        // Hum response data ko generic type 'ApiResponse' maan rahe hain
        const axiosErrorData = error.response?.data as ApiResponse | undefined;

        const customError = new Error(error.message) as CustomAxiosError;
        customError.status = error.response?.status || 0;
        customError.code = axiosErrorData?.code || error.code;

        if (error.response) {
            // Server responded with error status (4xx, 5xx)
            const { status } = error.response;

            customError.message =
                axiosErrorData?.message || `HTTP ${status} Error`;
            customError.data = axiosErrorData;
            customError.errors = axiosErrorData?.errors;

            // Log specific error codes for debugging
            if (status === 401) {
                console.warn("[Auth] Unauthorized - token may be expired");
            } else if (status === 429) {
                console.warn("[RateLimit] Too many requests");
            } else if (status === 403) {
                console.warn("[Auth] Forbidden - insufficient permissions");
            }
        } else if (error.request) {
            // Network error (no response received)
            customError.message =
                "Network error - please check your connection";
            customError.code = "NETWORK_ERROR";
        } else {
            // Request setup error
            customError.message = error.message || "Request failed";
            customError.code = "REQUEST_ERROR";
        }

        if (process.env.NODE_ENV === "development") {
            console.error("[API Error]", customError);
        }

        return Promise.reject(customError);
    }
);

// --- Helper Function ---

/**
 * Helper function to extract data from ApiResponse
 * NOTE: Is function mein koi change nahi hai, yeh theek hai.
 */
export function extractData<T>(response: ApiResponse<T> | T): T {
    if (
        typeof response === "object" &&
        response !== null &&
        "success" in response
    ) {
        const apiResponse = response as ApiResponse<T>;

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || "API request failed");
        }

        if (apiResponse.data === undefined || apiResponse.data === null) {
            // Server side error: success: true but data: null
            // Is logic ko server side data structure ke hisaab se adjust kar sakte hain.
            throw new Error("API returned success but no data");
        }

        return apiResponse.data;
    }

    return response as T;
}

export default axiosInstance;
