import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './forgetPassword.css'; 

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can handle the submission logic here, such as sending a reset password email
    console.log('Submit email:', email);
    navigate('/reset-password');
  };

  return (
    <div className="forgot-password-container">

    <Container className="mt-5 container ">
      <h6 className="text-right">FORGOT YOUR PASSWORD</h6>
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
          <Form.Text className="text-bold clickable">
            <Link to="/reset-password">Reset Password?</Link>
          </Form.Text>
        </Form.Group>
        <div className="btn-container">
          <Button type="submit" className="btn-success">
            Request Resent Link
          </Button>
        </div>
      </Form>
      <div className="text-center">
        <Form.Text className="text-bold clickable">
          <Link to="/login">Back to Login</Link>
        </Form.Text>
      </div>
    </Container>
    </div>

  );
}

export default ForgotPassword;