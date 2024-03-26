import React, { useState, useCallback, useEffect } from 'react';
import { Navbar, NavbarBrand, Nav, NavbarToggle, NavbarCollapse, Button, Form, FormControl, Container, Row, Col, Dropdown } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-bootstrap4';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faEdit, faSave, faTimes, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/dashboard.css';
import { PortURL } from './Config';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function Dashboard() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editedRowData, setEditedRowData] = useState(null);
  const [organization, setOrganization] = useState('');
  const [showPreview, setShowPreview] = useState(false); 
  const [uploadSuccess, setUploadSuccess] = useState(false); 
  const [selectedRows, setSelectedRows] = useState([]); 
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State to control Snackbar visibility
  const [retriveData, setRetriveData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      const storedUsername = localStorage.getItem('username');
      const storedOrganization = localStorage.getItem('Organisation');
      setUsername(storedUsername);
      setOrganization(storedOrganization); // Set organization in state
      fetchData();  
      setShowPreview(true); 
    }
  }, [navigate]);

  useEffect(() => {
    if (uploadSuccess) {
      setSnackbarOpen(true); // Show the Snackbar when upload is successful
      setTimeout(() => setUploadSuccess(false), 5000); // Reset upload success message after 5 seconds
    }
  }, [uploadSuccess]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${PortURL}/data`);
      if (response.ok) {
        const excelData = await response.json();
        setRetriveData(excelData);
        console.log("fetch data" , retriveData);
      } else {
        console.error('Failed to fetch data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onDrop = useCallback(acceptedFiles => {
    setData([]);
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        try {
          const workbook = XLSX.read(data, { type: 'buffer', cellDates: true });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, dateNF: "yyyy-mm-dd hh:mm:ss" });
          const trimmedData = jsonData.filter(row => row.some(cell => cell !== null && cell !== ''));
          const header = trimmedData.shift();
          const newJsonData = trimmedData.map(row => {
            const obj = {};
            header.forEach((key, index) => {
              obj[key] = row[index];
            });
            return obj;
          });
          console.log('New JSON Data:', newJsonData);
          setData(prevData => [...prevData, ...newJsonData]);
        } catch (error) {
          console.error('Error reading file:', error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const filteredData = retriveData.filter(row => {
    return Object.values(row || {}).some(value =>
      value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleSearchChange = e => {
    setSearchQuery(e.target.value);
  };

// Update handleEdit to store the ID of the row being edited
const handleEdit = (rowId) => {
  console.log("Editing row with ID:", rowId);
  setEditedRowData(rowId);
};

  const handleDelete = (rowId) => {

  const updatedData = retriveData.filter(row => row.id !== rowId);
  setRetriveData(updatedData);
};




  const handleCancel = () => {
    console.log("Canceling edit for row:", editedRowData);
    setEditedRowData(null);
  };

  const handleInputChange = (e, key) => {
    const { value } = e.target;
    console.log("Changing value of", key, "to", value, "for edited row");
    setEditedRowData(prevRowData => ({
      ...prevRowData,
      [key]: value
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleInvite = () => {
    navigate('/send-invite');
  };

  const formatDateHeading = (header) => {
    const dateParts = header.match(/\b(\w{3} \d{2})\b/);
    return dateParts ? dateParts[0] : header;
  };

  const formatDateCell = (value, columnName) => {
    if (typeof value === 'string' && columnName === 'Month/Year') {
      const [month, year] = value.split('/');
      const monthAbbreviation = month.substr(0, 3);
      return `${monthAbbreviation}-${year}`;
    } else if (value instanceof Date) {
      const month = value.toLocaleDateString('en-US', { month: 'short' });
      const year = value.getFullYear().toString().slice(-2);
      return `${month}${year}`;
    }
    return value;
  };

  const handleSubmit = async () => {
    try {
      const userData = {
        username: username,
        organization: organization
      };
      console.log("userData:", userData);
      console.log("Uploaded data:", data);
      const updatedData = data.map((row) => {
        if (row['Month/Year']) {
          const dateString = row['Month/Year'].toString();
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const seconds = '00';
          const formattedDate  = `${year}-${month}-${day}' '${hours}:${minutes}:${seconds}`;
          row['Month/Year'] = formattedDate;
        }
        return row;
      });
      const response = await fetch(`${PortURL}/bulk-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userData, data: updatedData })
      });
      if (response.ok) {
        // Clear uploaded data after successful submission
        setData([]);
        fetchData(); // Fetch updated data from the database
        const jsonResponse = await response.json();
        console.log(jsonResponse);
      } else {
  console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
    

  const handleCheckboxChange = (rowId) => {
    const updatedData = retriveData.map(row => {
      if (row.id === rowId) {
        return { ...row, checked: !row.checked }; 
      }
      return row;
    });
    setRetriveData(updatedData);
    const selectedRowsData = updatedData.filter(row => row.checked);
    setSelectedRows(selectedRowsData);
  };
  

  const handleSave = async () => {
    setEditedRowData(null); 
console.log("updated data : ",editedRowData);
    try {
      const response = await fetch(`${PortURL}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify({ editedRow: editedRowData }), // Wrap editedRowData in an object with the key 'editedRow'
      });
      if (response.ok) {
        const changedData = await response.json();
        console.log('Changed data:', changedData);
        setEditedRowData(null); // Reset editedRowData to exit editing mode
      } else {
        console.error('Failed to update data:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };
  
  return (
    <div className="dashboard-container">
      <Navbar bg="light" expand="lg" className="w-100">
        <div className="brand-wrapper">
          <NavbarBrand href="#home"> BCP Dashboard</NavbarBrand>
        </div>
        <NavbarToggle aria-controls="basic-navbar-nav" />
        <NavbarCollapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                <FontAwesomeIcon icon={faUser} /> {username}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>Profile</Dropdown.Item>
                <Dropdown.Item>Settings</Dropdown.Item>
                <Dropdown.Item onClick={handleInvite}>Send Invite</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </NavbarCollapse>
      </Navbar>
      <Container fluid>
        <div className="container-fluid full-height mt-5">
          <div className="row">
            <div className="col">
              <div className="border shadow p-3 d-flex justify-content-between align-items-center">
                <Form className="d-flex">
                  <div className="search-wrapper mr-2">
                    {/* <div className="search-icon">
                      <FontAwesomeIcon icon={faSearch} />
                    </div> */}

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
                      <Button className='btn btn-success btn-sm mx-5'><FontAwesomeIcon className='upload' icon={faUpload} />Upload File</Button>
                    }
                  </div>

                </Form>
                <div className="ml-4 mx-5">
                  <Button className="ma-2 mx-5" onClick={handleSubmit}>Submit</Button>
                  <Button className="ma-2" variant="danger" >
                    <FontAwesomeIcon icon={faTrash} /> Clear</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        message="Successfully uploaded data!"
        action={
          <React.Fragment>
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => setSnackbarOpen(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <br />
     
      <Container fluid>
  <Row>
    <Col>
      <div className="table-responsive render">
        <hr />
        {retriveData.length > 0 && (
          <>
            <div className="table-container">
              <Grid
                rows={filteredData}
                columns={[
                  { name: 'id', title: 'ID' },
                  ...Object.keys(filteredData[0] || {}).map(key => ({ name: key, title: formatDateHeading(key) })),
                  { name: 'actions', title: 'Actions' },
                ]}
              >
                <Table
                  rowComponent={({ row, ...restProps }) => (
                    <Table.Row
                      {...restProps}
                      key={row.id}
                      className={row.checked ? 'selected' : ''}
                    >
                      <Table.Cell>
                        <input
                          type="checkbox"
                          checked={row.checked || false}
                          onChange={() => handleCheckboxChange(row.id)}
                        />
                      </Table.Cell>
                      {Object.keys(row).map((key) => (
                        <Table.Cell key={key} column={{ name: key }}>
                          {editedRowData && editedRowData.id === row.id ? (
                            <FormControl
                              type="text"
                              value={editedRowData[key]}
                              onChange={(e) => handleInputChange(e, key)}
                            />
                          ) : (
                            formatDateCell(row[key], key) 
                          )}
                        </Table.Cell>
                      ))}
                      <Table.Cell>
                        {editedRowData && editedRowData.id === row.id ? (
                          <Button variant="success" onClick={() => handleSave(row.id)}>Save</Button>
                        ) : (
                          <>
                            <Button variant="warning" onClick={() => handleEdit(row)}>Edit</Button>
                            <Button variant="danger" onClick={() => handleDelete(row.id)}>Delete</Button>
                          </>
                        )}
                      </Table.Cell>
                    </Table.Row>
                  )}
                />
                <TableHeaderRow />
              </Grid>
            </div>
          </>
        )}
      </div>
    </Col>
  </Row>
</Container>

    </div>
  );
}

export default Dashboard;
