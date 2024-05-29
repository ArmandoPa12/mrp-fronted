// import { useEffect } from "react";
// import { createContext, useContext, useState } from "react";
// import { loginRequest, registerRequest, verifyTokenRequest } from "../api/auth";
// import Cookies from "js-cookie";

import React, { createContext, useState,useEffect  } from 'react';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    authToken: null,
    userId: null,
    modulos: [],
    user_id:null,
    rol_id:null,
    username:null
  });
  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const user_id = localStorage.getItem('user_id');
    const rol_id = localStorage.getItem('rol_id');
    const username = localStorage.getItem('username');

    const modulos = JSON.parse(localStorage.getItem('modulos')) || [];

    if (authToken && userId) {
      setAuthData({
        authToken,
        userId,
        modulos,
        user_id,
        rol_id,
        username
      });
    }
  }, []);

  const saveAuthData = (data) => {
    setAuthData({
        authToken: data.auth,
        userId: data.user_id,
        modulos: data.modulos,
        user_id: data.user_id,
        rol_id: data.rol_id,
        username: data.username
    });
    localStorage.setItem('authToken', data.auth);
    localStorage.setItem('userId', data.user_id);
    localStorage.setItem('user_id', data.user_id);
    localStorage.setItem('rol_id', data.rol_id);
    localStorage.setItem('username', data.username);
    localStorage.setItem('modulos', JSON.stringify(data.modulos));
  };

  const clearAuthData = () => {
    setAuthData({
        authToken: null,
        userId: null, 
        modulos: [],
        user_id:null,
        rol_id:null,
        username:null
    });
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('modulos');
    localStorage.removeItem('user_id');
    localStorage.removeItem('rol_id');
    localStorage.removeItem('username');
  };
  
  const isAuthenticated = () => {
    const authToken = localStorage.getItem('authToken');
    // console.log("Token actual:", authToken);
    return !!authToken;
  };

  return (
    <AuthContext.Provider value={{ authData, saveAuthData, clearAuthData,isAuthenticated }}>
        {children}
    </AuthContext.Provider>
  );

}

