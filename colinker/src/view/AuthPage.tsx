import React, { useState } from 'react';
import LoginForm from '../component/LoginForm';
import RegisterForm from '../component/RegisterForm';

const AuthPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="flex min-h-screen">
  <div className="w-3/5 flex justify-center items-center bg-white" 
       style={{ 
         backgroundImage: `url('/allpeople.jpg')`, 
         backgroundSize: 'cover', 
         backgroundPosition: 'center center', 
         backgroundRepeat: 'no-repeat',
         height: '100vh' 
       }}>
  </div>
  <div className="w-2/5 flex justify-center items-center bg-white">
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
