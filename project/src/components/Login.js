import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    role: '',
    email: '',
    password: '',
    newPassword: '',
    confirmPassword: '',
    otp: '',
    rememberMe: false,
  });
  const [authState, setAuthState] = useState('login'); // 'login', 'register', 'resetPassword'
  
  useEffect(() => {
    const storedEmail = Cookies.get('rememberedEmail');
    const storedRole = Cookies.get('rememberedRole');
    const storedPassword = Cookies.get('rememberedPassword');
    if (storedEmail && storedRole && storedPassword) {
      setFormData((prevData) => ({
        ...prevData,
        email: storedEmail,
        role: storedRole,
        password: storedPassword,
        rememberMe: true,
      }));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (authState === 'login') {
      await handleLogin();
    } else if (authState === 'register') {
      await handleRegister();
    } else if (authState === 'resetPassword') {
      await handleResetPassword();
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: formData.role,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        if (formData.rememberMe) {
          Cookies.set('rememberedEmail', formData.email, { expires: 7 });
          Cookies.set('rememberedRole', formData.role, { expires: 7 });
          Cookies.set('rememberedPassword', formData.password, { expires: 7 });
        } else {
          Cookies.remove('rememberedEmail');
          Cookies.remove('rememberedRole');
          Cookies.remove('rememberedPassword');
        }
        onLoginSuccess('/dashboard');
      } else {
        alert(data.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again later.');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: formData.role,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Registration successful! Please log in.');
        setAuthState('login'); // Switch back to login form
      } else {
        alert(data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again later.');
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await fetch('http://localhost:5000/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          otp: formData.otp,
          newPassword: formData.newPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Password reset successful!');
        setAuthState('login');
        setFormData((prevData) => ({
          ...prevData,
          otp: '',
          newPassword: '',
          confirmPassword: '',
        }));
      } else {
        alert(data.message || 'Password reset failed.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      alert('Password reset failed. Please try again later.');
    }
  };

  return (
    <div className="app-container">
      <h1>Welcome to ...!</h1>
      <div className="main-content">
        <div className="login-container">
          <form className="login-form" onSubmit={handleFormSubmit}>
            <h2>Hi</h2>
            <p>{authState === 'login' ? 'Log into your dashboard' : authState === 'register' ? 'Register' : 'Reset Your Password'}</p>
            {authState !== 'resetPassword' && (
              <>
                <label htmlFor="role">{authState === 'register' ? 'Register as' : 'Role'}</label>
                <select id="role" name="role" value={formData.role} onChange={handleInputChange} required>
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="department">Department Manager</option>
                  <option value="user">Manager</option>
                  <option value="employee">Employee</option>
                </select>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required />
                <label htmlFor="password">{authState === 'register' ? 'Password' : 'Password'}</label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} required />
              </>
            )}
            {authState === 'login' && (
              <div className="form-footer">
                <div className="remember-me">
                  <input type="checkbox" id="remember" name="rememberMe" checked={formData.rememberMe} onChange={(e) => setFormData((prevData) => ({ ...prevData, rememberMe: e.target.checked }))} />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <span className="forgot-password" onClick={() => setAuthState('resetPassword')}>Forgot Password</span>
              </div>
            )}
            {authState === 'resetPassword' && (
              <>
                <label htmlFor="otp">Enter OTP sent to {formData.email}</label>
                <input type="text" id="otp" name="otp" value={formData.otp} onChange={handleInputChange} required />
                <label htmlFor="newPassword">New Password</label>
                <input type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleInputChange} required />
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
              </>
            )}
            <button type="submit">{authState === 'login' ? 'Log In' : authState === 'register' ? 'Register' : 'Reset Password'}</button>
            {authState !== 'resetPassword' && (
              <span className="register-link" onClick={() => setAuthState(authState === 'login' ? 'register' : 'login')}>
                {authState === 'login' ? 'Create an account' : 'Already have an account? Log in'}
              </span>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
