import React, { useState, useEffect,useContext  } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import 'primeicons/primeicons.css';
import 'tailwindcss/tailwind.css';
import Layout from "./layout";


import { AuthContext } from '../context/authContext';


const Logout = () => {
    const { clearAuthData } = useContext(AuthContext);
    const navigate = useNavigate();
  
    useEffect(() => {
        clearAuthData(); // Clear authentication data
      navigate("/login"); // Redirect to login page
    }, [clearAuthData, navigate]);
  
    return <div>Logging out...</div>;
};
  
export default Logout;