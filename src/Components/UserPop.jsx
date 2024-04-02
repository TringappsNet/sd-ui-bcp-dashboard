import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTrash,faBan } from '@fortawesome/free-solid-svg-icons';
import { PortURL } from "./Config";
import '../styles/UserPop.css';

const UserPop = () => {
  const [excelData, setExcelData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedRowId, setEditedRowId] = useState(null);
  const [editedRole, setEditedRole] = useState(null); 
  const [roles, setRoles] = useState([]);

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

  const handleCheckboxChange = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(row => row !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };
  const handleEdit = async (index) => {
    try {
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
  
      // Perform API call to save updated data
      const response = await fetch(`${PortURL}/UpdateUsers/${updatedData[editedRowId].id}`, {
        method: 'PUT',
        body: JSON.stringify({ Role: editedRole }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        console.log('Role updated successfully');
      } else {
        console.error('Failed to update role:', response.statusText);
      }
  
      setExcelData(updatedData);
      setEditedRowId(null);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  const handleDeactivate = async () => {
    try {
      // Logic to deactivate selected users
      console.log('Deactivate selected users:', selectedRows);
      // Perform API call to deactivate selected users
    } catch (error) {
      console.error('Error deactivating users:', error);
    }
  };

  return (
    <Container fluid className="User-2">
      <Row className="row Render-rr">
        <h7 className="h7">USERS</h7>
        <button className="btn btn-sm Deactivate" onClick={handleDeactivate}>
            <FontAwesomeIcon icon={faBan} /> 
          </button>
        <Col className="col Render-cc">
          <div className="table-responsive render">
            <Table striped bordered hover>
              <thead className='checkbox-container' >
                <tr>
                  <th className='checkbox-container'>Checkbox</th>
                  {Object.keys(excelData[0] || {}).map((key) => (
                    <th  key={key}>{key}</th>
                  ))}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {excelData.map((row, index) => (
                  <tr key={index}>
                    <td className='checkbox-container ' >
                      <input
                     
                        type="checkbox"
                        checked={selectedRows.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </td>
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
                    <td className='action-button'>
                              {editedRowId === index ? (
                                <div  >
                                  <button className="btn btn-sm Save" onClick={handleSave}>
                                    <FontAwesomeIcon icon={faSave} />
                                  </button>
                                </div>
                              ) : (
                                <div >
                                  <button className="btn btn-sm Edit" onClick={() => handleEdit(index)}>
                                    <FontAwesomeIcon icon={faEdit} />
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









