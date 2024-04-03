import React from 'react';
import { Table } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEdit,
  faSave,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import '../styles/dashboard.css';

const ExcelGrid = ({
  filteredData,
  selectedRowIds,
  editedRowId,
  editedRowData,
  handleCheckboxChange,
  handleEdit,
  handleCancel,
  handleInputChange,
  handleSave,
  handleDelete,
  formatDateCell,
}) => {
  return (
    <Container fluid className="mt-2">
      <Row className="row Render-Row">
        <Col className="col Render-Col">
          <div className="table-responsive render">
            <Table striped bordered hover>
              <thead className="sticky-header">
                <tr>
                  <th className="selection-cell">
                    <input
                      type="checkbox"
                      checked={selectedRowIds.length === filteredData.length}
                      onChange={() => handleCheckboxChange(null)}
                    />
                  </th>
                  {Object.keys(filteredData[0] || {}).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th className="action-cell">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row, index) => (
                  <tr key={index}>
                    <td className="selection-cell">
                      <input
                        type="checkbox"
                        checked={selectedRowIds.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </td>
                    {Object.keys(row).map((key) => (
                      <td key={key}>
                        {editedRowId === index ? (
                          <input
                            type="text"
                            value={editedRowData[key] || ''}
                            onChange={(e) => handleInputChange(e, key)}
                          />
                        ) : (
                          formatDateCell(row[key], key)
                        )}
                      </td>
                    ))}
                    <td className="action-cell">
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
