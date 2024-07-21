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
    <div className="absolute top-40 w-full text-center p-4">
      <h1 className='font-bold text-3xl font-sans'>COLINKER</h1>
    </div>
    <div className="mt-20 w-80">
      {isLoginView ? (
        <LoginForm onRegisterClick={() => setIsLoginView(false)} />
      ) : (
        <RegisterForm onLoginClick={() => setIsLoginView(true)} />
      )}
    </div>
  </div>
</div>

  );
};

export default AuthPage;
