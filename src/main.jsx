import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/authContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  //<React.StrictMode>
    <GoogleOAuthProvider clientId="312406723411-vqjb9kr969fd4giig6dvmm8l7gfucclk.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  //</React.StrictMode>
);
