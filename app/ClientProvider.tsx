'use client';

import React from 'react';
import { UserProvider } from './context/useAuth';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      {children}
      <ToastContainer />
    </UserProvider>
  );
};

export default ClientProvider;
