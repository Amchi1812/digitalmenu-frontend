import axios from "axios";
import toast from "react-hot-toast";


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5237/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {

        if (!error.response) {
            toast.error('Problem sa mrežom. Provjerite internet konekciju.');
        } else if (error.response.status === 500) {
            toast.error('Došlo je do greške na serveru (500).');
        } else if (error.response.status === 403) {
            toast.error('Nemate pravo pristupa ovoj akciji.');
        }


        if (error.response?.status === 401) {
            localStorage.removeItem('token');

            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }

        }

        return Promise.reject(error);


    }
);

export default api;