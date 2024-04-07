import React from 'react';
import { Form, Input, Button } from 'antd';
import {login} from '../service/authService';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ onRegisterClick }) => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      console.log('Login Values:', values);
      const response = await login(values);
      console.log(response);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        
        navigate('/Home');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Form name="login" onFinish={onFinish}>
      <h1 className='my-3'>Veuillez vous enregistrer</h1>
      <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
        <Input placeholder="Username" />
      </Form.Item>
      <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
        <Input.Password placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          Login
        </Button>
      </Form.Item>
      <Form.Item>
        <Button type="link" onClick={onRegisterClick}>
          No account? Register here.
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
