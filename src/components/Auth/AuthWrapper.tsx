import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthWrapper: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) {
    return <RegisterForm onBackToLogin={() => setShowRegister(false)} />;
  }

  return <LoginForm onShowRegister={() => setShowRegister(true)} />;
};
