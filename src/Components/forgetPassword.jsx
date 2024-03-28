import React, { useState } from 'react';
import { Container, Form, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/forgetPassword.css'; 
import { TextField } from '@mui/material';
import Header from './Header';
import axios from 'axios'; 
import { PortURL } from './Config';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(   `${PortURL}/forgot-password`, { email });
      console.log(response.data.message); 
    } catch (error) {
      console.error('Error sending reset link email:', error);
    }
  };

  return (
    <div>
            

      <Header/>
        <div className=" form d-flex justify-content-center align-items-center vh-100 ">
            <Container className="mt-5 shadow p-3 mb-5 bg-body   vh-70 " >
              <h6 className="text-center mb-4 mt-2 forget">Forget Password</h6>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <TextField 
                    className='label'
                    type="email"
                    label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Form.Group>
               
                <div className="btn-container mt-4 mb-3">
                  <Button type="submit" className="btn btn-success  rounded-pill">
                    Request Resent Link
                  </Button>
                </div>
                <div className="text-center mt ">
              <Link to="/login" className='link'>Back to Login</Link>
              </div>
              </Form>
              
            </Container>

            </div>
    </div>

  );
}

export default ForgotPassword;