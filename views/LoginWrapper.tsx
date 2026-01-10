import React from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import { User } from '../types';

const LoginWrapper: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = (u: User) => {
    try {
      localStorage.setItem('mdoner_user', JSON.stringify(u));
    } catch {}
    navigate('/app');
  };

  return <Login onLogin={handleLogin} />;
};

export default LoginWrapper;
