import React from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../service/authService';

const RegisterForm = ({ onLoginClick }) => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await register(values);
      console.log("Registered");
      
      if (response && (response.status === 200 || response.status === 204)) {
        const { username, password } = values;
        const credentials = { username, password };        
        const res = await login(credentials);
        if (res.token) {
          navigate('/Home');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <Form name="register" onFinish={onFinish}>
      <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
        <Input placeholder="Email" />
      </Form.Item>

      <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
        <Input placeholder="Username" />
      </Form.Item>

      <Form.Item name="firstName" rules={[{ required: true, message: 'Please input your firstname!' }]}>
        <Input placeholder="Prénom" />
      </Form.Item>

      <Form.Item name="lastName" rules={[{ required: true, message: 'Please input your lastname!' }]}>
        <Input placeholder="Nom" />
      </Form.Item>

      <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
        <Input.Password placeholder="Password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="w-full">
          Register
        </Button>
      </Form.Item>
      <Form.Item>
        <Button type="link" onClick={onLoginClick}>
          Already have an account? Login here.
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
