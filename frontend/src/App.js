import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import ReservationPage from './components/FreeReservationPage';
import ReservationPage1 from './components/ReservationPage';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/planner" element={<ReservationPage1 />} />
        <Route path="/planner/all" element={<ReservationPage />} />
        <Route path='*' element={<Navigate to='/planner' />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
