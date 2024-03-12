import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './resetPassword.css'; 

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can handle the submission logic here, such as sending a reset password email
    console.log('Submit email:', email);
    console.log('New password:', password);
    console.log('Confirm password:', confirmPassword);
  };

  return (
    <Container className="mt-5 container">
      <h6 className="text-right">RESET YOUR PASSWORD</h6>
      <p className="text-right">Strong passwords includes numbers, letters, and punctuation marks</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Enter Email address</Form.Label>
          <Form.Control 
            className='label'
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword">
          <Form.Label>Enter New Password</Form.Label>
          <Form.Control 
            className='label'
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicConfirmPassword">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control 
            className='label'
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        <div className="btn-container">
          <Button type="submit" className="btn-success">
            Reset Password
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default ResetPassword;