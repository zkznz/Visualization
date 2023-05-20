import axios from 'axios'

const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL + '/api',
    timeout: 7000
})
service.interceptors.request((config) => {
    return config;
})
service.interceptors.response((res) => {
    return res;
})

export default service;