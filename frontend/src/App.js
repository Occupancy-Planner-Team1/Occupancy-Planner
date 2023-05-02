<<<<<<< HEAD
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
=======
import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import LoginPage from './components/LoginPage';
import ReservationPage from './components/FreeReservationPage';
import ReservationPage1 from './components/ReservationPage';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/planner" element={<ReservationPage1 />} />
        <Route path="/planner/all" element={<ReservationPage />} />
      </Routes>
    </BrowserRouter>
>>>>>>> test
  );
}

export default App;
