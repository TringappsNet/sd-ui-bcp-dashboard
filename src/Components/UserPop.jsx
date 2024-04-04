import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { PortURL } from './Config';

export default function StickyHeadTable() {
  const [excelData, setExcelData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // State to hold filtered data
  const [columns, setColumns] = useState([]);
  const [roles, setRoles] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  const [editingValue, setEditingValue] = useState({});
  const [deactivatedRows, setDeactivatedRows] = useState([]);

  useEffect(() => {
    fetchData();
    fetchRoles();
  }, []);

  useEffect(() => {
    setFilteredData(excelData); // Initialize filteredData with excelData on component mount
  }, [excelData]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${PortURL}/users`);
      if (response.ok) {
        const data = await response.json();
        setExcelData(data);

        // Extract columns from the first data object received
        if (data.length > 0) {
          const keys = Object.keys(data[0]);
          const extractedColumns = keys.map((key) => ({
            id: key,
            label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
            minWidth: 60, // Set default minWidth
          })).filter(column => column.id !== 'isActive'); // Exclude isActive column
          setColumns(extractedColumns);
        }
      } else {
        console.error('Failed to fetch Excel data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching Excel data:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${PortURL}/Get-Role`);
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      } else {
        console.error('Failed to fetch roles:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleEdit = async (index) => {
    try {
      // Check if the row is deactivated
      if (!deactivatedRows.includes(index)) {
        console.log('Editing row:', index);
        // Fetch roles data
        const response = await fetch(`${PortURL}/Get-Role`);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched roles data:', data);
          setRoles(data);
        } else {
          console.error('Failed to fetch roles:', response.statusText);
        }

        // Set edited row ID
        setEditingRowId(index);

        // Set edited role
        const selectedRole = excelData[index].Role.trim() ? excelData[index].Role : null;
        console.log('Selected Role:', selectedRole);
        setEditingValue({ ...excelData[index] });
      } else {
        console.log('Row is deactivated. Cannot edit.');
      }
    } catch (error) {
      console.error('Error editing row:', error);
    }
  };

  const handleRoleChange = (event) => {
    const selectedRole = event.target.value;
    console.log('Selected Role:', selectedRole);
    setEditingValue({ ...editingValue, Role: selectedRole });
  };

  const handleSave = async () => {
    try {
      const updatedData = [...excelData];
      updatedData[editingRowId] = { ...editingValue };

      // Retrieve session ID and organization from localStorage
      const sessionId = localStorage.getItem('sessionId');
      const organization = localStorage.getItem('Organization');
      const email = localStorage.getItem('email');

      // Perform API call to save updated data
      const response = await fetch(`${PortURL}/Updateuser`, {
        method: 'POST',
        body: JSON.stringify({ organization, Role: editingValue.Role, email }),
        headers: {
          'Content-Type': 'application/json',
          'Session-ID': sessionId,
          'Email': email  // Assuming you have 'email' stored in localStorage as well
        }
      });

      if (response.ok) {
        console.log('Role updated successfully');
        const responseData = await response.json(); // Parse response JSON
        // Handle responseData as needed
      } else {
        console.error('Failed to update role:', response.statusText);
      }

      setExcelData(updatedData);
      setEditingRowId(null);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDeactivate = async (index) => {
    try {
      // Perform API call to deactivate user
      const email = localStorage.getItem('email');

      const response = await fetch(`${PortURL}/user-Active`, {
        method: 'PUT',
        body: JSON.stringify({   isActive: false, email }), // Include isActive status in the request body
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('User deactivated successfully');

        // Update excelData state to mark the user as deactivated
        const updatedData = [...excelData];
        // updatedData[index].Status = 'Inactive'; // Assuming 'Status' is the column indicating user status
        setExcelData(updatedData);
        setDeactivatedRows([...deactivatedRows, index]);

        // Show success message to the user
        alert('User deactivated successfully');


      } else {
        console.error('Failed to deactivate user:', response.statusText);
        // Handle failure response as needed
        alert('Failed to deactivate user');
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('Error deactivating user');
    }
  };

  const handleCancel = () => {
    setEditingRowId(null);
  };

  const handleSearchChange = (event) => {
    const searchText = event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search
    const filtered = excelData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchText)
      )
    );
    setFilteredData(filtered);
  };

  return (
    <div className='Container'>
    <div className="row mb-3">
    <div className="col">
      <h3>USERS</h3>
    </div>
    <div className="col">
      <input type="text" className="form-control" placeholder="Search..." onChange={handleSearchChange} />
    </div>
  </div>
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: '80vh' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="center"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row, index) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                {columns.map((column) => (
                  <TableCell key={column.id} align="center">
                    {editingRowId === index && column.id === 'Role' ? (
                      <Select
                        value={editingValue[column.id]}
                        onChange={handleRoleChange}
                      >
                        {roles.map((role) => (
                          <MenuItem key={role.role_ID} value={role.role}>
                            {role.role}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      row[column.id]
                    )}
                  </TableCell>
                ))}
                <TableCell align="center d-flex">
                  {editingRowId === index ? (
                    <>
                      <Button onClick={handleSave}>Save</Button>
                      <Button onClick={handleCancel}>Cancel</Button>
                    </>
                  ) : (
                    <Button onClick={() => handleEdit(index)}>Edit</Button>
                  )}
                  <Button onClick={() => handleDeactivate(index)}>Deactivate</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
    </div>
  );
}
