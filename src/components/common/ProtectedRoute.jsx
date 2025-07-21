import React from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {  
  const authToken = useDispatch((state) => state.userappdetails.TOKEN);  
  if (!authToken) {    
    return <Navigate to="/login" replace />;
  }
  return children; 
};

export default ProtectedRoute;