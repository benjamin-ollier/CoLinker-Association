import React, { useState } from 'react';
import LoginForm from '../component/LoginForm';
import RegisterForm from '../component/RegisterForm';

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex justify-center items-center bg-blue-500" style={{ backgroundImage: `url('/creation_association.jpeg')`, backgroundSize: 'cover', backgroundPosition: 'center center', backgroundRepeat: 'no-repeat' }}>
      </div>
      <div className="flex-1 flex justify-center items-center bg-white">
        {isLoginView ? (
          <LoginForm onRegisterClick={() => setIsLoginView(false)} />
        ) : (
          <RegisterForm onLoginClick={() => setIsLoginView(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
