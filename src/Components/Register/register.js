import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './register.css';

function Register() {
  const [username, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requestBody = {
      userName: username,
      password: newPassword,
      email: email,
      organization: company,
      phoneNo: phoneNumber,
    };
    console.log(requestBody);

    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        console.log('User registered successfully!');
        navigate('/login');
      } else {
        console.error('Error registering user:', response.statusText);
      }
    } catch (error) {
      console.error('Error registering user:', error.message);
    }
  };
  
  return (
    <Container className="mt-5 shadow p-3 mb-5 bg-body rounded container vh-70 ">
      
      <h6 className="text-center mb-4 mt-4 fw-normal">REGISTRATION FORM!!!</h6>
      <Form onSubmit={handleSubmit}>
       
            <Form.Group controlId="formFirstName"  className="mb-3">
              <Form.Label className="fw-bold">Username </Form.Label>
              <Form.Control
                className="label"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>
          
               <Form.Group controlId="formEmailAddress" className="mb-3">
          <Form.Label className="fw-bold">Email Address</Form.Label>
          <Form.Control
            className="label"
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formCompany" className="mb-3">
          <Form.Label className="fw-bold" >Company</Form.Label>
          <Form.Control
            className="label"
            type="text"
            placeholder="Enter company name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formPhoneNumber" className="mb-3">
          <Form.Label className="fw-bold">Phone Number</Form.Label>
          <div className="input-group">
            <span className="input-group-text">+91</span>
            <Form.Control
              className="label"
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </Form.Group>
        <Form.Group controlId="formNewPassword" className="mb-3">
          <Form.Label className="fw-bold">New Password</Form.Label>
          <div className="input-group">
            <Form.Control
              className="label"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span
              className="show-hide-text"
              onClick={toggleNewPasswordVisibility}
            >
              {showNewPassword ? 'Hide' : 'Show'}
            </span>
          </div>
        </Form.Group>
        <Form.Group controlId="formConfirmPassword" className="mb-3">
          <Form.Label className="fw-bold">Confirm Password</Form.Label>
          <div className="input-group">
            <Form.Control
              className="label"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="show-hide-text"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </span>
          </div>
        </Form.Group>
        <div className="btn-container mt-5 mb-4">
          <Button type="submit" className="btn-success">
            Submit
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default Register;
