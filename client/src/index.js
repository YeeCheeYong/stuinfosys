import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { AuthProvider } from './context/authContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ChakraProvider>
);
