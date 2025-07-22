import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/authContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  //<React.StrictMode>
    <GoogleOAuthProvider clientId="610678762174-fnclg74ph275t4du3tb5k4gg67nsr1k1.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  //</React.StrictMode>
);
