import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email, 'Password:', password);
    // Add your authentication logic here (e.g., call an API, authenticate with a service, etc.)
    navigate("/planner");
  };

  return (
    <div>
      <p className="mb-0">Willkommen zurück</p>
      <h2 className="mb-4">Bei Ihrem Konto anmelden</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control py-2" value={email} onChange={(e) => setEmail(e.target.value)} id="email" required/>
        </div>
        <div className="mb-5">
          <label htmlFor="password" className="form-label">Passwort</label>
          <input type="password" className="form-control py-2" value={password} onChange={(e) => setPassword(e.target.value)} id="password" required/>
        </div>
        <button type="submit" className="btn btn-dark w-100 py-2">Anmelden</button>
      </form>
    </div>
  );
};

export default Login;