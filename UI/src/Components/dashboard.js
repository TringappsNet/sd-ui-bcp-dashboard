import React, { useState, useCallback } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggle, NavbarCollapse, Button, Form, FormControl, Container, Row, Col } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-bootstrap4';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/dashboard.css';

function Dashboard() {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

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
        console.log('New JSON Data:', newJsonData); // Debugging
        setData(prevData => [...prevData, ...newJsonData]); // Append new data to existing data
      };
      reader.readAsBinaryString(file);
    }
  }, []);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleLogout = () => {
    console.log('Logging out...');
  };

  const filteredData = data.filter(row => {
    return Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="form d-flex flex-column justify-content-start vh-100">
      <Navbar bg="light" expand="lg" className="w-100">
        <NavbarBrand href="#home"> BCP Dashboard</NavbarBrand>
        <NavbarToggle aria-controls="basic-navbar-nav" />
        <NavbarCollapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Link to="/login" className="nav-link">
              <Button variant="danger" onClick={handleLogout}>Logout</Button>
            </Link>
          </Nav>
        </NavbarCollapse>
      </Navbar>

      <div className="container mt-4">
        <Form className="form-inline">
          <div className="mr-2 mt-2">
            <FontAwesomeIcon icon={faSearch} />
          </div>
          <FormControl type="text" placeholder="Search" style={{ flex: '1' }} onChange={handleSearchChange} />
          <div {...getRootProps()} className="custom-file-upload">
            <input {...getInputProps()} accept=".xlsx, .xls" />
            {isDragActive ?
              <p>Drop the files here ...</p> :
              <Button>Upload File</Button>
            }
          </div>
        </Form>
      </div>
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
                    <Table />
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
