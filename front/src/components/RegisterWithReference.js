import React, { useState } from 'react';
import { useReference } from '../services/referenceService';

const RegisterWithReference = () => {
  const [formData, setFormData] = useState({
    code: '',
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const useHandleRegister = async () => {
    try {
      await useReference(formData);
      alert('User registered successfully!');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <div>
      <h2>Register with Reference</h2>
      <input
        type="text"
        name="code"
        placeholder="Reference Code"
        value={formData.code}
        onChange={handleChange}
      />
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      <button onClick={useHandleRegister}>Register</button>
    </div>
  );
};

export default RegisterWithReference;
