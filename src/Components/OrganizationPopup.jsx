import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { PortURL } from "./Config";
import '../styles/ExcelGrid.css'; // Assuming you have a CSS file for styling
import '../styles/OrgPopup.css'; // Assuming you have a CSS file for styling

const OrgPop = ({ handleClose }) => {
  const [excelData, setExcelData] = useState([]);
  const [editedRowIndex, setEditedRowIndex] = useState(null);
  const [editedOrgName, setEditedOrgName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  return (
    <Container fluid className="mt-2">
      <Row className="row Render-Row1">
        <Col className="col col1 Render-Col">
          <div>
            <h4>ORGANIZATIONS</h4>
          </div>
          {successMessage && <div className="success-message">{successMessage}</div>}
          <div className="table-container">
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
                        {editedRowIndex === index && key === 'org_name' ? (
                          <input
                            type="text"
                            value={editedOrgName}
                            onChange={handleInputChange}
                          />
                        ) : (
                          row[key]
                        )}
                      </td>
                    ))}
                    <td className="action-cell">
                      {editedRowIndex === index ? (
                        <div className="action-buttons">
                          <button className="btn btn-sm Save" onClick={handleSave}>
                            <FontAwesomeIcon icon={faSave} />
                          </button>
                          <button className="btn btn-sm Cancel" onClick={() => setEditedRowIndex(null)}>
                            <FontAwesomeIcon icon={faTimesCircle} />
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
