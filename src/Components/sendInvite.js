import React, { useState } from 'react';
import { Container, Button, Form } from 'react-bootstrap';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material'; 
import '../styles/sendInvite.css';

const SendInvite = ({ onClose, onSubmit }) => {
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

  return (
    <div className="form d-flex justify-content-center align-items-center">
      <Container className="mt-6 p-4 shadow bg-body">
        <h6 className="text-center mb-4 mt-1 ">Send Invite</h6>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail" className="mb-3">
            <TextField
              className="label"
              type="email"
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
          <Form.Group controlId="formBasicOrganization" className="mb-3">
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
          <Button type="submit" className="btn btn-success rounded-pill w-100">Submit</Button>
        </Form>
      </Container>
    </div>
  );
};

export default SendInvite;
