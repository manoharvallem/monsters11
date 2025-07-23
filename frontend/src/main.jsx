import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css' // Import our global styles
import { AuthProvider } from './context/AuthContext.jsx'; // <-- Import AuthProvider

// This finds the 'root' div in index.html and renders our App component inside it.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* <-- Wrap App with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
