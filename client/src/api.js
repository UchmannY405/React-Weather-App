import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config)=>{
    const token = localStorage.getItem("token");
    if(token)
    {
        config.headers.Authorization= `Bearer ${token}`
    }
    return config;
});

api.interceptors.response.use(
    (res)=>res,
    (error)=>{
        const code = err?.response?.data?.code;
        const status = err?.response?.status;
        if (status===401 || code==='AUTH_INVALID_TOKEN' || code==='AUTH_REQUIRED')
        {
            localStorage.removeItem('token');
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }    
);

export default api;

