import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../styles/dashboard.css';
import '../styles/ExcelGrid.css';


const ExcelGrid = ({
  filteredData,
  selectedRowIds,
  editedRowId,
  editedRowData,
  handleEdit,
  handleCancel,
  handleInputChange,
  handleSave,
  handleDelete,
  // formatDateCell,
  roleID // Pass Role_ID as a prop
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
const requestSort = (key) => {
  let direction = 'ascending';
  if (sortConfig.key === key && sortConfig.direction === 'ascending') {
    direction = 'descending';
  }
  
  // For "MonthYear" column, sort by parsed month and year values
  if (key === 'MonthYear') {
    setSortConfig({ key, direction });
  } else {
    setSortConfig({ key, direction });
  }
};


  const sortedData = () => {
    if (sortConfig.key !== null) {
      const sorted = [...filteredData].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      return sorted;
    }
    return filteredData;
  };

 const formatMonthYear = (dateString) => {
  // Parse the date string into a Date object
  const date = new Date(dateString);
  // Add one minute to the date
  date.setMinutes(date.getMinutes() + 1);
  // Extract month and year components
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear().toString().substr(-2);
  // Format the month and year into the desired format
  return `${month.toUpperCase()} ${year}`;
};




const formatDateCell = (value, key) => {
if (key === "MonthYear") {
return formatMonthYear(value);
}
return value;
};




  return (
    <Container fluid className="mt-2">
      <Row className="row Render-Row">
        <Col className="col Render-Col">
          <div className="table-responsive render">
            <Table striped bordered hover>
              <thead className="sticky-header">
                <tr>
                {Object.keys(filteredData[0] || {}).map((key) => (
                    key !== 'ID' && // Exclude the 'id' column
                    <th key={key} onClick={() => requestSort(key)}>
                      {key}
                      {sortConfig.key === key && (
                        <span>{sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}</span>
                      )}
                    </th>
                  ))}
                  <th className="action-cell">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedData().map((row, index) => (
                        <tr key={index}>
                        {Object.keys(row).map((key) => (
                          key !== 'ID' && (
                            <td key={key}>
                            {editedRowId === index ? (
                              (key === 'CompanyName') ? (
                                <span>{editedRowData[key]}</span> // Display the company name as a span instead of an input
                              ) : (
                                key === 'MonthYear' ? (
                                  <input
                                    type="date"
                                    value={editedRowData[key] || ''}
                                    onChange={(e) => handleInputChange(e, key)}
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={editedRowData[key] || ''}
                                    onChange={(e) => handleInputChange(e, key)}
                                  />
                                )
                              )
                            ) : (
                              <span>{key === 'MonthYear' ? formatMonthYear(row[key]) : row[key]}</span>
                            )}
                          </td>
                          
                          )
                        ))}
                    <td className="action-cell">
                    {roleID == 1 || roleID == 2 ? (
                      <>
                        {editedRowId === index ? (
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm Save"
                              onClick={() => handleSave()}
                            >
                              <FontAwesomeIcon icon={faSave} />
                            </button>
                            <button
                              className="btn btn-sm Cancel"
                              onClick={() => handleCancel()}
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          </div>
                        ) : (
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm Edit"
                              onClick={() => handleEdit(index)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              className="btn btn-sm Delete"
                              onClick={() => handleDelete(index)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                      {editedRowId === index ? (
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm Save"
                            onClick={() => handleSave()}
                          >
                            <FontAwesomeIcon icon={faSave} />
                          </button>
                          <button
                            className="btn btn-sm Cancel"
                            onClick={() => handleCancel()}
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm Edit disabled" // Add disabled class
                            onClick={() => handleEdit(index)}
                          >
                            <FontAwesomeIcon icon={faEdit} className="blur-icon" /> {/* Apply blur to the icon */}
                          </button>
                          <button
                            className="btn btn-sm Delete disabled" // Add disabled class
                            onClick={() => handleDelete(index)}
                          >
                            <FontAwesomeIcon icon={faTrash} className="blur-icon" /> {/* Apply blur to the icon */}
                          </button>
                        </div>
                      )}

                    </>
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

export default ExcelGrid;
