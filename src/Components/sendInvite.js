import React, { useState } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material'; 
import { useNavigate } from 'react-router-dom'; 
import '../styles/sendInvite.css';

const SendInvite = ({ onClose, onSubmit }) => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    email: '',
    role: '',
    organization: '',
    age: ''
  });

  const [emailError, setEmailError] = useState(''); 

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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.email.trim()) {
      setEmailError('Email is required');
      return;
    }

    onSubmit(formData.email, formData.role, formData.organization);
  };

  const handleClose = () => {
    navigate('/dashboard'); 
  };

  return (
    <Container className="mt-5 shadow p-3 mb-5 bg-body rounded container vh-70 container-margin">
      <h6 className="text-center signup mb-5">SEND INVITE</h6>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <TextField
            className="label"type="email"
            name="email"
            label="Email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            size="small"
            error={!!emailError}
            helperText={emailError}
          />
        </Form.Group>
        <Form.Group className="mb-4 ">
          <FormControl fullWidth>
            <InputLabel id="role-select">Role</InputLabel>
            <Select
              labelId="role-select"
              name="role"
              label="Role"
              value={formData.role}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
            </Select>
          </FormControl>
        </Form.Group>
        <Form.Group className="mb-3">
          <FormControl fullWidth>
            <InputLabel id="organization-select">Organization</InputLabel>
            <Select
              labelId="organization-select"
              name="organization"
              label="Organization"
              value={formData.organization}
              onChange={handleChange}
              fullWidth
              size="small"
            >
              <MenuItem value="organization1">Organization 1</MenuItem>
              <MenuItem value="organization2">Organization 2</MenuItem>
              <MenuItem value="organization3">Organization 3</MenuItem>
            </Select>
          </FormControl>
        </Form.Group>
        
        <div className="d-flex justify-content-between">
          <Button variant="primary" type="submit">Submit</Button>
          <Button variant="secondary" onClick={handleClose}>Close</Button> 
        </div>
      </Form>
    </Container>
  );
};

export default SendInvite;