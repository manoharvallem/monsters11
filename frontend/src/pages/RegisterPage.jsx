import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthForm from '../components/AuthForm';

function RegisterPage() {
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (credentials) => {
    try {
      await register(credentials.username, credentials.password);
      navigate('/'); // Redirect to the feed on successful registration
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    }
  };

  return <AuthForm formType="register" onSubmit={handleRegister} error={error} />;
}

export default RegisterPage;
