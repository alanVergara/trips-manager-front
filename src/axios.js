import axios from 'axios';

axios.defaults.baseURL = "http://127.0.0.1:8000/api/";

axios.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token');

        if (token) {
            config.headers['Authorization'] = `Token ${ token }`;
        }

        return config;
    }
);