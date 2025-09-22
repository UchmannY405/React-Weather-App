import { createContext, useContext, useEffect, useState } from "react";
import {api} from '../api'

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if(!token)
    {
      setLoading(false);
      return;
    }

    async () =>{
      try
      {
        const res = await api.get('/auth/me');
        const user = res.data.data.user;
        setUser(user);
      }
      catch(err)
      {
        console.log(err);
        localStorage.removeItem('token');
        setUser(null)
      }
      finally
      {
        setLoading(false);
      }
    }
  },[]);

  const login = async (email,password)=>{
    const res = await api.post('/auth/login', {email,password});
     const user = res.data.data.user;
     setUser(user);
     const token = res.data.data.token;
     localStorage.setItem("token", token);
  };
  
  const updatedUser = async (email, city, country, latitude, longitude) => {
    const res = await api.patch('/users/me', { email, city, country, latitude, longitude });
    const user = res.data.data.updatedUser;
    setUser(user);
  };

  const logout = ()=>{
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updatedUser}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


