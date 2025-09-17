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

  const logout = ()=>{
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

/* 
SUMMARY:
1. The authProvider component is used to manage the user state and define the login and logout functions. 
2. AUTHprovider uses Authcontext.provider which is a property of Authcontext to make this available to the entire app when AuthProvider is used 
to wrap the app in main.js. 
3. Define useAuth hook to hold usecontext(authContext) which can carry the values held by authProvider to anywhere its needed in the app.
*/
