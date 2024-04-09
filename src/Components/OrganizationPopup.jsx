import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimesCircle, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'; // Import the trash icon
import { PortURL } from "./Config";
import '../styles/ExcelGrid.css'; // Assuming you have a CSS file for styling
import '../styles/OrgPopup.css'; // Assuming you have a CSS file for styling

const OrgPop = ({ handleClose }) => {
  const [excelData, setExcelData] = useState([]);
  const [editedRowIndex, setEditedRowIndex] = useState(null);
  const [editedOrgName, setEditedOrgName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [addMode, setAddMode] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${PortURL}/Get-Org`);
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

  const handleEdit = (index) => {
    setEditedRowIndex(index);
    setEditedOrgName(excelData[index].org_name);
  };

  const handleInputChange = (event) => {
    setEditedOrgName(event.target.value);
  };

  const handleSave = async () => {
    try {
      const updatedData = [...excelData];
      updatedData[editedRowIndex].org_name = editedOrgName;

      const response = await fetch(`${PortURL}/update-org`, {
        method: 'PUT',
        body: JSON.stringify({ org_id: updatedData[editedRowIndex].org_ID, new_org_name: editedOrgName }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('Organization updated successfully');
        setSuccessMessage('Organization updated successfully');
      } else {
        console.error('Failed to update organization:', response.statusText);
      }

      setExcelData(updatedData);
      setEditedRowIndex(null);
      setEditedOrgName('');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleAddRow = () => {
    setAddMode(true);
    setEditedOrgName('');
    setEditedRowIndex(null);
  };

  const handleSaveNewOrg = async () => {
    try {
      const response = await fetch(`${PortURL}/create-org`, {
        method: 'POST',
        body: JSON.stringify({ org_name: editedOrgName }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('New organization created successfully');
        setSuccessMessage('New organization created successfully');
        fetchData();
      } else {
        console.error('Failed to create new organization:', response.statusText);
      }

      setAddMode(false);
      setEditedOrgName('');
    } catch (error) {
      console.error('Error saving new organization:', error);
    }
  };

  const handleDeleteRow = async (index) => {
    try {
      const orgIDToDelete = excelData[index].org_ID;
      const response = await fetch(`${PortURL}/delete-Org`, {
        method: 'DELETE',
        body: JSON.stringify({ org_ID :orgIDToDelete}),

        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('Organization deleted successfully');
        setSuccessMessage('Organization deleted successfully');
        fetchData();
      } else {
        setErrorMessage('Delete failed: Organization assigned to user!');
        console.error('Failed to delete organization:', response.statusText);
      }
    } catch (error) {
      setErrorMessage('Delete failed: Organization assigned to user!');
      console.error('Error deleting organization:', error);
    }
  };

  return (
    <Container fluid className=" mt-10">
      <Row className="row Render-Row1">
        <Col className="col col1 Render-Col">
          <div className='OrgHead'>
            <h4>ORGANIZATIONS</h4>
            <button className="btn btn-sm Add" onClick={handleAddRow}>
              <FontAwesomeIcon icon={faPlus} /> Add Organization
            </button>
          </div>
          {successMessage && <div className="success-message">{successMessage}</div>}
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className=" Org-pop-container table-container">
            <Table striped bordered hover className='grid'>
              <thead className="sticky-header">
                <tr>
                  {Object.keys(excelData[0] || {}).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th className='action-button action-width'>Action</th>
                </tr>
              </thead>
              <tbody>
              {addMode && (
                  <tr>
                    <td colSpan={Object.keys(excelData[0] || {}).length}>
                      <input
                        type="text"
                        className='OrgIn'
                        placeholder="New organization "
                        value={editedOrgName}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <div className='editSave action-buttons'>
                        <div onClick={handleSaveNewOrg}>
                          <FontAwesomeIcon icon={faSave} />
                        </div>
                        <div onClick={() => setAddMode(false)}>
                          <FontAwesomeIcon icon={faTimesCircle} />
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                {excelData.map((row, index) => (
                  <tr key={index}>
                    {Object.keys(row).map((key, i) => (
                      <td key={i}>
                        {editedRowIndex === index && key === 'org_name' ? (
                          <input
                            type="text"
                            className='OrgIn'
                            value={editedOrgName}
                            onChange={handleInputChange}
                          />
                        ) : (
                          row[key]
                        )}
                      </td>
                    ))}
                    <td>
                      {editedRowIndex === index && !addMode ? (
                        <div className='editSave action-buttons'>
                          <div onClick={handleSave}>
                            <FontAwesomeIcon icon={faSave} />
                          </div>
                          <div onClick={() => setEditedRowIndex(null)}>
                            <FontAwesomeIcon icon={faTimesCircle} />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <button className="btn btn-sm Edit" onClick={() => handleEdit(index)}>
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button className="btn btn-sm Delete" onClick={() => handleDeleteRow(index)}> {/* Delete button */}
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              
              </tbody>
            </Table>
          </div>
          {/* <div>
            <button className="btn btn-sm Add" onClick={handleAddRow}>
              <FontAwesomeIcon icon={faPlus} /> Add Organization
            </button>
          </div> */}
        </Col>
      </Row>
    </Container>
  );
};

export default OrgPop;
