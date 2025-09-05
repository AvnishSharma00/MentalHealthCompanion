
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { LoginProvider } from './context/login-context.jsx'
import { TherapistProvider } from './context/therapist-context.jsx'
import { AuthInitializer } from './Auth-Checker/index.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LoginProvider>
      <TherapistProvider>
        <AuthInitializer>
            <App />
    {/* your routes */}
</AuthInitializer>
      
      </TherapistProvider>
    </LoginProvider>
  </BrowserRouter>
)
