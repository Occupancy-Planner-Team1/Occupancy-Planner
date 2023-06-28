import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthContextProvider } from "./components/shared/AuthContext";
import ProtectedRoute from "./components/shared/ProtectedRoute";

//Pages
import Reservations from './pages/Reservations';
import SuggestedReservation from './pages/SuggestedReservation';
import KeycloakLogin from "./pages/KeycloakLogin";

// Style
import "bootstrap/dist/css/bootstrap.min.css"
import './assets/App.css';

function App() {
  return (
    <>
      <AuthContextProvider>
        <Routes>
          <Route path="/login" element={<ProtectedRoute accessBy="non-authenticated"><KeycloakLogin /></ProtectedRoute>} />
          <Route path="/planner" element={<ProtectedRoute accessBy="authenticated"><Reservations /></ProtectedRoute>} />
          <Route path='*' element={<Navigate to='/planner' />} />
        </Routes>
      </AuthContextProvider>
    </>
  );
}

export default App;
