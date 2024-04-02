import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { PortURL } from './Config';
import Header from './Header';
import CustomSnackbar from './Snackbar';
import { TextField, InputAdornment } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoadingSpinner from './LoadingSpinner'; 


function Login() {
  const [email, setEmail] = useState(''); // Corrected typo
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const navigate = useNavigate();


  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    if (!email) {
      setSnackbarMessage('Email is required');
      setSnackbarOpen(true);
      return;
    }
  
    if (!password) {
      setPasswordError('Password is required');
      setSnackbarMessage('Password is required');
      setSnackbarOpen(true);
      return;
    }
  
    if (!email.includes('@')) {
      setSnackbarMessage('Please enter a valid email');
      setSnackbarOpen(true);
      return;
    }
  
    const requestBody = { email, password };
  
    try {
      const response = await fetch(`${PortURL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        const data1 = await response.json();
  
        localStorage.setItem('sessionId', data1.sessionId);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('UserName', data1.UserName);
        localStorage.setItem('email', data1.email);
        localStorage.setItem('Organisation', data1.Organization);

        localStorage.setItem('createdAt', data1.createdAt);

  
        navigate('/dashboard');
      } else {
        const data = await response.json();
  
        if (response.status === 400) {
          setSnackbarMessage(data.message);
        } else if (response.status === 401) {
          setSnackbarMessage('Invalid password!');
        } else {
          setSnackbarMessage('An error occurred while logging in.');
        }
  
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setSnackbarMessage('An error occurred while logging in.');
      setSnackbarOpen(true);
    }
  
    setLoading(false);
  };

  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage('');
  };

  return (
   <div>
     <Header />
    <div className="form d-flex justify-content-center align-items-center ">
      <Container className="con mt-5 p-4 shadow  ">
        <h6 className="text-center mb-2 mt-1 display-6 ">Sign in</h6>
        {/* <p>Navigate your Business with Ease!!!</p> */}
        
        {serverError && (
          <div className="text-center mt-2">
            <p className="text-danger">{serverError}</p>
          </div>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail" className="mb-3 mt-5">
          <TextField
            className={`label form-control ${emailError ? 'error' : ''}`}
            type="email"
            label="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value); // Corrected typo
              setEmailError('');
              setServerError('');
            }}
            fullWidth
            variant="outlined"
            size="small"
            error={!!emailError}
          />
          </Form.Group>
          <Form.Group controlId="formBasicPassword" className="mb-2 mt-2 ">
          <TextField
            className={`label form-control ${passwordError ? 'error' : ''}`}
            type={showPassword ? 'text' : 'password'}
            label="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError('');
              setServerError('');
            }}
            fullWidth
            variant="outlined"
            size="small"
            error={!!passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {showPassword ? (
                    <VisibilityIcon onClick={togglePasswordVisibility} />
                  ) : (
                    <VisibilityOffIcon onClick={togglePasswordVisibility} />
                  )}
                </InputAdornment>
              ),
            }}
          />
          </Form.Group>
          <Row className="mb-2 mt-1 ">
            <Col>
              <Form.Text className="text-left">
                <Link to="/forgot-password">Forgot Password?</Link>
              </Form.Text>
            </Col>
          </Row>
          {/* <Row className="mb-3">
            <Col>
              <Form.Check
                type="checkbox"
                label="Remember me"
                className="text-right"
              />
            </Col>
          </Row> */}
          <div className="btn-container mt-5 mb-5">
            <Button type="submit" className="btn btn-success  rounded-pill ">
              Sign in
            </Button>
          </div>
        </Form>
        
      </Container>
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        onClose={handleCloseSnackbar}
      />
    </div>
    {loading && <LoadingSpinner />} 
   </div>
  );
}

export default Login;
