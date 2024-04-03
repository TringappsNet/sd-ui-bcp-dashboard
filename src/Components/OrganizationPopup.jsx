import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faBan, faSearch, faTrash} from '@fortawesome/free-solid-svg-icons';
import { PortURL } from "./Config";
import '../styles/OrgPopup.css';

const OrgPop = () => {
  const [excelData, setExcelData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedRowId, setEditedRowId] = useState(null);
  const [editedOrgName, setEditedOrgName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${PortURL}/Get-Org`);
      if (response.ok) {
        const data = await response.json();
        setExcelData(data);
        setFilteredData(data); // Initialize filtered data with all data
      } else {
        console.error('Failed to fetch Excel data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching Excel data:', error);
    }
  };

  const handleCheckboxChange = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(row => row !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const handleEdit = (index) => {
    setEditedRowId(index);
    setEditedOrgName(excelData[index].org_name);
  };

  const handleSave = async () => {
    try {
      const updatedData = [...excelData];
      updatedData[editedRowId].org_name = editedOrgName;
  
      // Perform API call to save updated data
      const response = await fetch(`${PortURL}/update-org`, {
        method: 'PUT',
        body: JSON.stringify({ org_id: updatedData[editedRowId].org_ID, new_org_name: editedOrgName }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        console.log('Organization updated successfully');
        // Update the local state or fetch data again to refresh the list
      } else {
        console.error('Failed to update organization:', response.statusText);
      }
  
      setExcelData(updatedData);
      setEditedRowId(null);
      setEditedOrgName('');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  
  // const handleDeactivate = async () => {
  //   try {
  //     // Logic to deactivate selected organizations
  //     console.log('Deactivate selected organizations:', selectedRows);
  //     // Perform API call to deactivate selected organizations
  //   } catch (error) {
  //     console.error('Error deactivating organizations:', error);
  //   }
  // };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${PortURL}/delete-Org`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ org_ID: id }) // Include the organization ID in the request body
      });
      if (response.ok) {
        const data = await response.json(); 
        console.log('Organization deleted successfully. ID:', data.organizationId);
        // Handle the organization ID as needed
      } else {
        console.error('Failed to delete organization:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
    }
  };

  
  

  const handleSearch = () => {
    const filtered = excelData.filter((org) => org.org_name.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredData(filtered);
  };

  return (
    <Container fluid className="User-2">
      <Row className="row Render-rr">
        <h7 className="h7">Organization</h7>
        <div className="search-container">
          <input
            type="text"
            placeholder=" Organization "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* <button className="btn btn-sm Search">
            <FontAwesomeIcon icon={faSearch} />
          </button> */}
        </div>
        {/* <button className="btn btn-sm Deactivate" onClick={handleDeactivate}>
          <FontAwesomeIcon icon={faBan} />
        </button> */}
<Col className="col Render-cc">
  <div className="table-responsive render">
    <Table striped bordered hover>
      <thead className="sticky-header">
        <tr  >
          <th className="sticky-checkbox">Checkbox</th>
          <th>Organization ID</th>
          <th>Organization Name</th>
          <th className="action-column">Action</th> 
        </tr>
      </thead>
      <tbody>
        {filteredData.map((org, index) => (
          <tr key={org.org_ID}>
            <td className="sticky-checkbox">
              <input
                type="checkbox"
                checked={selectedRows.includes(index)}
                onChange={() => handleCheckboxChange(index)}
              />
            </td>
            <td>{org.org_ID}</td>
            <td>
              {editedRowId === index ? (
                <input
                  type="text"
                  value={editedOrgName}
                  onChange={(e) => setEditedOrgName(e.target.value)}
                />
              ) : (
                org.org_name
              )}
            </td>
            <td className="action-column"> {/* Add the action-column class */}
  {editedRowId === index ? (
    <div className="action-buttons">
      <button className="btn btn-sm Save" onClick={handleSave}>
        <FontAwesomeIcon icon={faSave} />
      </button>
    </div>
  ) : (
    <div className="action-buttons">
      <button className="btn btn-sm Edit" onClick={() => handleEdit(index)}>
        <FontAwesomeIcon icon={faEdit} />
      </button>
    </div>
  )}
</td>
<td className="action-column"> {/* Add the action-column class */}
  <div className="action-buttons">
    <button className="btn btn-sm Delete" onClick={() => handleDelete(org.org_ID)}>
      <FontAwesomeIcon icon={faTrash} />
    </button>
  </div>
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

export default OrgPop;
