import React from 'react'
import { useAuth } from '../features/AuthContext'
import { Navigate} from 'react-router-dom';

function ProtectedRoute ({children}) {
    const {user} = useAuth();    
    if (typeof user === "undefined") {
      return null; 
    }
  return <>
    {user ? children  : <Navigate to="/login" />
  }</>;
}

export default ProtectedRoute