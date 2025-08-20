import React from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {  
  const authToken = useSelector((state) => state.userappdetails.TOKEN);  
  if (!authToken) {    
    return <Navigate to="/login" replace />;
  }
  return children; 
};

export default ProtectedRoute;