import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PersistGate } from 'redux-persist/integration/react';
import { store,persistor } from './redux/store.ts';
import { Provider } from 'react-redux';
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>  
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>  

      <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </GoogleOAuthProvider>
    </Provider>
    
  </StrictMode>,
)
