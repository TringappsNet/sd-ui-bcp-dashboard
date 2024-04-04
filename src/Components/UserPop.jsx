import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTrash, faBan, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { PortURL } from "./Config";
import '../styles/UserPop.css';

const UserPop = ({ handleClose }) => {
  const [excelData, setExcelData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [editedRowId, setEditedRowId] = useState(null);
  const [editedRole, setEditedRole] = useState(null);
  const [roles, setRoles] = useState([]);
  const [deactivatedRows, setDeactivatedRows] = useState([]);
  
  useEffect(() => {
    fetchData();
    fetchRoles();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${PortURL}/users`);
      if (response.ok) {
        const data = await response.json();
        setExcelData(data);
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
        setEditedRowId(index);

        // Set edited role
        const selectedRole = excelData[index].Role.trim() ? excelData[index].Role : null;
        console.log('Selected Role:', selectedRole);
        setEditedRole(selectedRole);
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
    setEditedRole(selectedRole);
  };

  const handleSave = async () => {
    try {
      const updatedData = [...excelData];
      updatedData[editedRowId].Role = editedRole;

      // Retrieve session ID and organization from localStorage
      const sessionId = localStorage.getItem('sessionId');
      const organization = localStorage.getItem('Organization');
      const email = localStorage.getItem('email');

      // Perform API call to save updated data
      const response = await fetch(`${PortURL}/Updateuser`, {
        method: 'POST',
        body: JSON.stringify({ organization, Role: editedRole, email }),
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
      setEditedRowId(null);
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

  return (
    <Container fluid className="mt-2">
     
      <Row className="row Render-Row1">
     
        <Col className="col col1 Render-Col">
        <div>
        <h4>USERS</h4>
      </div>
          <div className="table-container" style={{  marginTop: '20px', height: '600px', overflowY: 'auto' }}>
            <Table striped bordered hover className='grid'>
              <thead className="sticky-header">
                <tr>
                  {Object.keys(excelData[0] || {}).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th className="action-cell">Action</th>
                </tr>
              </thead>
              <tbody>
                {excelData.map((row, index) => (
                  <tr key={index}>
                    {Object.keys(row).map((key, i) => (
                      <td key={i}>
                        {editedRowId === index && key === 'Role' ? (
                          <select value={editedRole || ''} onChange={handleRoleChange} style={{ color: 'black' }}>
                            {roles.length > 0 && roles.map(role => (
                              <option key={role.role_ID} value={role.role}>{role.role}</option>
                            ))}
                          </select>
                        ) : (
                          row[key]
                        )}
                      </td>
                    ))}
                    <td className="action-cell">
                      {editedRowId === index ? (
                        <div className="action-buttons">
                          <button className="btn btn-sm Save" onClick={handleSave}>
                            <FontAwesomeIcon icon={faSave} />
                          </button>
                          <button className="btn btn-sm Cancel" onClick={() => setEditedRowId(null)}>
                            <FontAwesomeIcon icon={faTimesCircle} />
                          </button>
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <button className="btn btn-sm Edit" onClick={() => handleEdit(index)}>
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button className="btn btn-sm Deactivate" onClick={() => handleDeactivate(index)}>
                            <FontAwesomeIcon icon={faBan} />  
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserPop;

