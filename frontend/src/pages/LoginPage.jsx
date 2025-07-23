import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

function LoginPage() {
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials.username, credentials.password);
      navigate('/'); // Redirect to the feed on successful login
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log in. Please try again.');
    }
  };

  return <AuthForm formType="login" onSubmit={handleLogin} error={error} />;
}

export default LoginPage;
