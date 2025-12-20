import axios from 'axios';
import { supabase } from '@/core/lib/supabase';

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add Supabase Token to every request
http.interceptors.request.use(async (config) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Interceptor for error handling (Optional but recommended)
http.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors here (e.g., 401 Unauthorized -> Redirect to login)
        if (error.response?.status === 401) {
            // Optional: Trigger a logout action or redirect
            console.warn('Unauthorized access, redirecting to login...');
        }
        return Promise.reject(error);
    }
);

export default http;
