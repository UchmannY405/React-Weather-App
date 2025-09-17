import React from 'react'
import { useAuth } from '../features/AuthContext'


const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div>Welcome {user.name}</div>
  )
}

export default Dashboard