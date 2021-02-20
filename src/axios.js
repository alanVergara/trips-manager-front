import axios from 'axios';

/**
 * Define base URL for API consume
 */
axios.defaults.baseURL = "http://127.0.0.1:8000/api/";

/**
 * Interceptor for add Authorization header in requests
 */
axios.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token');

        if (token) {
            config.headers['Authorization'] = `Token ${ token }`;
        }

        return config;
    }
);