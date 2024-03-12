import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import './Login.css'
function Login() {
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
    <div className=" form d-flex justify-content-center align-items-center vh-100 ">

    <Container className="con mt-5 p-4  shadow bg-body rounded">
      <h6 className="text-center mb-5 mt-3 fw-normal ">Sign in</h6>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail" className="mb-4 mt-4">
          <Form.Control 
            className='label'
            type="email"
            placeholder="Email or phone"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formBasicPassword" className="mb-2 mt-4">
          <Form.Control 
            className='label'
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
    
        <Row className="mb-4  ">
          <Col>
            <Form.Text className="text-left">
              <Link to="/forgot-password">Forgot Password?</Link>
            </Form.Text>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <Form.Check
              type="checkbox"
              label="Remember me"
              className="text-right"
            />
          </Col>
        </Row>
        <div className="btn-container mt-5 ">
          <Button type="submit" className="btn-success">
            Sign in
          </Button>
        </div>
      </Form>

    </Container>
    <div className="text-center mt-3 ">
        New to BCP? <Link to="/register">Sign up</Link>
      </div>
    </div>

  );
}

export default Login;
