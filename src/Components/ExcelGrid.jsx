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
    // Split the dateString into month and year parts
    const [monthStr, yearStr] = dateString.split(' ');
    // Convert the month string into a number (0-indexed)
    const month = new Date(Date.parse(monthStr + ' 1, 2000')).getMonth();
    // Get the year as a number
    const year = parseInt(yearStr) + 2000; // Assuming '22' means '2022'
  
    // Format the date using Intl.DateTimeFormat
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric'
    }).format(new Date(year, month));
  
    return formattedDate;
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
                                          key !== 'ID' && // Exclude the 'id' column

                    <td key={key}>
                       
                       {editedRowId === index ? (
                          key === 'CompanyName' || key === 'MonthYear' ? ( // Make 'CompanyName' and 'MonthYear' uneditable
                            <span>{row[key]}</span>
                          ) : (
                            <input
                              type="text"
                              value={editedRowData[key] || ''}
                              onChange={(e) => handleInputChange(e, key)}
                            />
                        )
                        ) : (
                          key === 'MonthYear' ? ( // Make 'MonthYear' uneditable
                            <span>{formatMonthYear(row[key])}</span>
                          ) : (
                            row[key]
                          )
                        )}
                      </td>
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
