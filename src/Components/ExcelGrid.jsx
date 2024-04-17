import React, { useState, useEffect } from 'react';
  import { Table } from 'react-bootstrap';
  import { Container, Row, Col } from 'react-bootstrap';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faEdit, faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
  import '../styles/dashboard.css';
  import '../styles/ExcelGrid.css';
  import {columnMap, reverseColumnMap} from "../Objects/Objects";
import { Key } from 'react-bootstrap-icons';



  
  const ExcelGrid = ({
    filteredData,
    selectedRowIds,
    editedRowId,
    editedRowData,
    setEditedRowData,
    handleEdit,
    handleCancel,
    handleInputChange,
    handleSave,
    handleDelete, 
    editedRow,
    rowToDelete,
    roleID 
  }) => {
    
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  

    useEffect(() => {
    
      if (editedRowId !== null) {
        const editedRow = sortedData()[editedRowId];
        if (editedRow) {
          setEditedRowData(editedRow);
        }
      }
    }, [sortConfig, editedRowId,rowToDelete]);
    
    
    const requestSort = (key) => {
      if (Key) {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
          direction = 'descending';
        }
        
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
    const date = new Date(dateString);
    date.setMinutes(date.getMinutes() );
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().substr(-2);
    return `${month.toLocaleString()}-${year}`;
  };






  const formatNumber = (number) => {
    if (!number) return ''; 
    let formattedNumber = number.toString();
    const parts = formattedNumber.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    formattedNumber = parts.join('.');

    return formattedNumber;
  };


  const reversedColumnMap = reverseColumnMap(columnMap);

    return (
      <Container fluid className="mt-2">
        <Row className="row Render-Row">
          <Col className="col Render-Col">
            <div className="table-responsive render">
              <Table striped bordered hover>
                <thead className="sticky-header">
                  <tr>
                  {Object.keys(filteredData[0] || {}).map((key) => (
                      key !== 'ID' && 
                      <th key={key} onClick={() => requestSort(key)}>
                        {reversedColumnMap[key] || key}
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
                                          <span>{editedRowData[key]}</span>
                                        ) : (
                                          key === 'MonthYear' ? (
                                            <span>{formatMonthYear(row[key])}</span> 
                                          ) : (
                                            <input
                                              type="text"
                                              className='GridInput'
                                              value={editedRowData[key]}
                                              onChange={(e) => handleInputChange(e, key)}
                                            />
                                          )
                                        )
                                      ) : (
                                        <span>{key === 'MonthYear' ? formatMonthYear(row[key]) : formatNumber(row[key])}</span>
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
                                onClick={() => handleEdit(index,row.ID)}
                              >
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button
                                className="btn btn-sm Delete"
                                onClick={() => handleDelete(index,row.ID)}
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
                              className="btn btn-sm Edit disabled" 
                              onClick={() => handleEdit(index)}
                            >
                              <FontAwesomeIcon icon={faEdit} className="blur-icon" />
                            </button>
                            <button
                              className="btn btn-sm Delete disabled" 
                              onClick={() => handleDelete(index)}
                            >
                              <FontAwesomeIcon icon={faTrash} className="blur-icon" /> 
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
