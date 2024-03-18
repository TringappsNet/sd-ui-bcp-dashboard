import React, { useState, useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory hook

import {
  Navbar,
  NavbarBrand,
  Nav,
  NavbarToggle,
  NavbarCollapse,
  Button,
  Form,
  FormControl,
  Container,
  Row,  
  Col,
  Dropdown
} from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { Link, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import {
  Grid,
  Table,
  TableHeaderRow
} from '@devexpress/dx-react-grid-bootstrap4';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faUser,
  faEdit,
  faSave,
  faTimes
} from '@fortawesome/free-solid-svg-icons'; // Import user, edit, and save icons
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/dashboard.css';

function Dashboard() {
  const [username, setUsername] = useState('');

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editedValues, setEditedValues] = useState({});
  
  const navigate = useNavigate();

 
useEffect(() => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (!isLoggedIn) {
    navigate('/login');
  } else {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
    // const { pathname } = window.location;
    // if (pathname === '/dashboard' || pathname === '/dashboard/') {
    //   navigate('/', { replace: true });
    // }  
  }
}, [navigate]);

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0 && acceptedFiles[0] instanceof Blob) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const newJsonData = XLSX.utils.sheet_to_json(sheet);
        console.log('New JSON Data:', newJsonData); 
        setData(prevData => [...prevData, ...newJsonData]); // Append new data to existing data
      };
      reader.readAsBinaryString(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const filteredData = data.filter(row => {
    return Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (id) => {
    console.log("Editing row:", id);
    setEditedValues(prevValues => ({
      ...prevValues,
      [id]: { ...data.find(row => row.id === id) }
    }));
  };

  const handleSave = (id) => {
    console.log("Saving edited values for row:", id);
    setData(data.map(row => (row.id === id ? { ...row, ...editedValues[id] } : row)));
    setEditedValues(prevValues => {
      const updatedValues = { ...prevValues };
      delete updatedValues[id];
      return updatedValues;
    });
  };
  
  const handleCancel = (id) => {
    console.log("Canceling edit for row:", id);
    setEditedValues(prevValues => {
      const updatedValues = { ...prevValues };
      delete updatedValues[id];
      return updatedValues;
    });
  };
  
  const handleInputChange = (e, id, key) => {
    const { value } = e.target;
    console.log("Changing value of", key, "to", value, "for row:", id);
    setEditedValues(prevValues => ({
      ...prevValues,
      [id]: {
        ...prevValues[id],
        [key]: value
      }
    }));
  };
  const handleLogout = () => {
    // Clear user information from local storage
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');

    navigate('/login');
  };


  return (
    <div className="dashboard-container">
     <Navbar bg="light" expand="lg" className="w-100">
  <div className="brand-wrapper">
    <NavbarBrand href="#home" > BCP Dashboard</NavbarBrand>
  </div>
  <NavbarToggle aria-controls="basic-navbar-nav" />
  <NavbarCollapse id="basic-navbar-nav">
    <Nav className="ml-auto">
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic">
          <FontAwesomeIcon icon={faUser} /> {username}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Nav>
  </NavbarCollapse>
</Navbar>

      <Container fluid>
  <Row className="justify-content-center mt-5">
    <Col xs={12} md={3}>
      <Form className="d-flex">
        <div className="search-wrapper mr-2">
          <div className="search-icon">
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <FormControl 
            type="text" 
            placeholder="Search" 
            style={{ flex: '1' }} 
            value={searchQuery}
            onChange={handleSearchChange} 
          />
        </div>
        <div {...getRootProps()} className="custom-file-upload">
          <input {...getInputProps()} accept=".xlsx, .xls" />
          {isDragActive ?
            <p>Drop the files here ...</p> :
            <Button>Upload File</Button>
          }
        </div>
      </Form>
    </Col>
  </Row>
</Container>


      <br />
      
      <Container fluid>
        <Row>
          <Col>
            <div className="table-responsive">
              {filteredData.length > 0 && (
                <div className="table-container">
                  <Grid
                    rows={filteredData}
                    columns={Object.keys(filteredData[0] || {}).map(key => ({ name: key, title: key }))}
                  >
                    <Table
                      rowComponent={({ row,...restProps }) => (
                        <Table.Row
                          {...restProps}
                          // Add a unique key to each row
                          key={row.id}
                        >
                          {Object.keys(row).map((key) => (
                            <Table.Cell
                              key={key}
                              column={{ name: key }}
                            >
                              {editedValues[row.id] && editedValues[row.id][key] !== undefined ? (
                                <FormControl
                                  type="text"
                                  value={editedValues[row.id][key]}
                                  onChange={(e) => handleInputChange(e, row.id, key)}
                                />
                              ) : (
                                row[key]
                              )}
                            </Table.Cell>
                          ))}
                          <Table.Cell>
                            {editedValues[row.id] ? (
                              <>
                                <Button variant="success" onClick={() => handleSave(row.id)}>
                                  <FontAwesomeIcon icon={faSave} />
                                </Button>
                                <Button variant="danger" onClick={() => handleCancel(row.id)}>
                                  <FontAwesomeIcon icon={faTimes} />
                                </Button>
                              </>
                            ) : (
                              <Button variant="primary" onClick={() => handleEdit(row.id)}>
                                <FontAwesomeIcon icon={faEdit} />
                              </Button>
                            )}
                          </Table.Cell>
                        </Table.Row>
                      )}
                    />
                    <TableHeaderRow />
                  </Grid>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
