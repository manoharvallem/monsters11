import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  return (
    <div>
      <AuthForm formType="login" onSubmit={handleLogin} error={error} />
      <p className="mt-4 text-sm text-center text-gray-400">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-cyan-400 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
