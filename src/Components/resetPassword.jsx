import React, { useState,useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { TextField } from '@mui/material';
import { PortURL } from './Config';
import LoadingSpinner from './LoadingSpinner';
import { useNavigate } from 'react-router-dom';


function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailId, setEmailId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    const email = localStorage.getItem('email');
    const session = localStorage.getItem('sessionId');
    setEmailId(email);
    setSessionId(session);
  }, []);
   
   
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
  
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
  
    const requestBody = {
      resetToken: resetToken,
      newPassword: newPassword
    };

    const headers = {
      'Content-Type': 'application/json',
      'Email-ID': emailId,
      'Session-ID': sessionId
    };
  
    try {
      const response = await fetch(`${PortURL}/reset-password`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        setSuccess(true);
        setError(null);
        setTimeout(() => {
          navigate('/login');
        }, 5000);
      } else {
        const data = await response.json();
        setError(data.message);
        setSuccess(false);
      }
    } catch (error) {
      console.error('Error resetting password:', error.message);
      setError('Error resetting password');
    }
    setLoading(false);
  };
  

  return (
    <div className="form d-flex justify-content-center align-items-center">
      <Container className=" mt-6 p-4 shadow bg-body ">
        <h6 className="text-center mb-4 mt-1 ">Reset Password</h6>
        <Form onSubmit={handleSubmit}>
          {/* {error && <div className="text-danger mb-3">{error}</div>} */}
          {success && <div className="text-success mb-3">Password reset successfully!</div>}
          <Form.Group controlId="formBasicNewPassword" className="mb-4">
            <TextField
              className="label"
              type="password"
              label="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            />
          </Form.Group>
          <Form.Group controlId="formBasicConfirmNewPassword" className="mb-4">
            <TextField
              className="label"
              type="password"
              label="Confirm new password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            />
          </Form.Group>
          <div className="btn-container">
            <Button type="submit" className="btn btn-success rounded-pill w-100">Reset Password</Button>
          </div>
        </Form>
      </Container>
      {loading && <LoadingSpinner />}
    </div>
  );
}

export default ResetPassword;
