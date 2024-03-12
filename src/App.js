import './App.css';
import ForgotPassword from './Components/ForgetPassword/forgetPassword';
import ResetPassword from './Components/ResetPassword/resetPassword';
import Register from './Components/Register/register';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login/Login';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
    </Routes>
  </Router>
  );
}

export default App;
