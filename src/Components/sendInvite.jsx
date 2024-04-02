import React, { useState, useEffect } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import '../styles/sendInvite.css';
import { PortURL } from './Config';
import LoadingSpinner from './LoadingSpinner'; 

const SendInvite = ({ onClose }) => {
  const initialFormData = {
    email: '',
    role: '',
    organization: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false); 
  const [emailError, setEmailError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (name === 'email') {
      setEmailError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); 
  
    if (!formData.email.trim()) {
      setEmailError('Email is required');
      setLoading(false);
      return;
    }
  
    if (!formData.role.trim()) {
      setEmailError('Role is required');
      setLoading(false);
      return;
    }
  
    if (!formData.organization.trim()) {
      setEmailError('Organization is required');
      setLoading(false);
      return;
    }
  
    try {

       // Retrieve session ID and email from local storage
    const sessionId = localStorage.getItem('sessionId');
    const email = localStorage.getItem('email');

      const response = await fetch(`${PortURL}/send-invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Session-ID': sessionId, 
        'Email': email 
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log(data);
      setSuccessMessage('Invitation sent successfully');
      setFormData(initialFormData); // Reset form data to initial empty values
      onClose();
    } catch (error) {
      console.error('Error sending invitation:', error);
    }
  
    setLoading(false);
  };
  
  
  return (
    <div className="form d-flex justify-content-center align-items-center">
      <Container className="mt-6 p-4 shadow bg-body">
        <h6 className="text-center mb-4 mt-1 ">Send Invite</h6>
        {successMessage && (
          <div className="text-success mb-3">{successMessage}</div>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail" className="mb-3">
            <TextField
              className="label"
              type="text"
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              size="small"
              error={!!emailError}
              helperText={emailError}
            />
          </Form.Group>
          <Form.Group controlId="formBasicRole" className="mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="role-select">Role</InputLabel>
              <Select
                labelId="role-select"
                name="role"
                label="Role"
                value={formData.role}
                onChange={handleChange}
                
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="employee">Employee</MenuItem>
              </Select>
            </FormControl>
          </Form.Group>
          <Form.Group controlId="formBasicOrganization" className="mb-3">
            <FormControl fullWidth size="small">
              <InputLabel id="organization-select">Organization</InputLabel>
              <Select
                labelId="organization-select"
                name="organization"
                label="Organization"
                value={formData.organization}
                onChange={handleChange}
              >
                <MenuItem value="Tringapps">Tringapps</MenuItem>
                <MenuItem value="Techi-Track">Techi-Track</MenuItem>
                <MenuItem value="Jean-Martin">Jean-Martin</MenuItem>
              </Select>
            </FormControl>
          </Form.Group>
          <Button type="submit" className="btn btn-success rounded-pill w-100">Submit</Button>
        </Form>
      </Container>
      {loading && <LoadingSpinner />}
    </div>
  );
};

export default SendInvite;
