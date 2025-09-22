import axios from 'axios'


const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const publicApi = axios.create({
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
    (err)=>{
        const code = err?.response?.data?.code;
        const status = err?.response?.status;
        const url = err?.config?.url || '';

        const isAuthErr = status === 401 || code === "AUTH_INVALID_TOKEN" || code === "AUTH_REQUIRED";
        const isUrl = url.includes('/auth/login');
        if (isAuthErr && !isUrl)
        {
            localStorage.removeItem('token');
            window.location.href = "/login";
        }
        return Promise.reject(err);
    }    
);

export {api, publicApi};

