import React from 'react';
import { Form, Input, Button } from 'antd';

const RegisterForm = ({ onLoginClick }) => {
  const onFinish = (values) => {
    console.log('Register Values:', values);
    // Implémentez votre logique d'inscription ici
  };

  return (
    <Form name="register" onFinish={onFinish}>
      <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
        <Input placeholder="Email" />
      </Form.Item>
      <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
        <Input placeholder="Username" />
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
