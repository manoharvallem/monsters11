import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  return (
    <div>
      <AuthForm formType="register" onSubmit={handleRegister} error={error} />
       <p className="mt-4 text-sm text-center text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-cyan-400 hover:underline">
          Log In
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
