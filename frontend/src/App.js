import "bootstrap/dist/css/bootstrap.min.css"
import './App.css';
import LoginPage from './components/LoginPage';
import ReservationPage from './components/ReservationPage';
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/planner" element={<ReservationPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
