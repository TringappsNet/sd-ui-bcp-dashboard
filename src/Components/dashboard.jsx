  import React, { useState, useCallback, useEffect } from "react";
  import { Table } from "react-bootstrap";
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
    Dropdown  } from "react-bootstrap";
  import { useDropzone } from "react-dropzone";
  import { useNavigate , Link
  } from "react-router-dom";
  import * as XLSX from "xlsx";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import {
    faSearch,
    faUser,
    faEdit,
    faSave,
    faTimes,
    faTrash,
    faUpload,
  } from "@fortawesome/free-solid-svg-icons";
  import "bootstrap/dist/css/bootstrap.min.css";
  import "../styles/dashboard.css";
  import PopUpContainer from "./popup";
  import ResetNewPassword from "./resetNewPassword";
  import CustomSnackbar from "./Snackbar";
  import { PortURL } from "./Config";
  import LoadingSpinner from './LoadingSpinner'; 
  import ResetPassword from "./resetPassword";
  import ConfirmationModal from "./ConfirmationModal";



  function Dashboard() {
    const [username, setUsername] = useState("");
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [editedRowId, setEditedRowId] = useState(null); // Track edited row ID
    const [editedRowData, setEditedRowData] = useState({}); // Track edited row data
    const [loading, setLoading] = useState(false); 
    const [organization, setOrganization] = useState("");
    const [email, setEmail] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [selectedRowIds, setSelectedRowIds] = useState([]); // Track selected row IDs
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [retriveData, setRetriveData] = useState([]);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const [navbarCollapsed, setNavbarCollapsed] = useState(false); // Track Navbar collapse state
    const [snackbarColor, setSnackbarColor] = useState("success"); 
    const [uploadedFileName, setUploadedFileName] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);


    const navigate = useNavigate();

    
    useEffect(() => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (!isLoggedIn) {
        navigate("/login");
      } else {
        const storedUsername = localStorage.getItem("UserName");
        const storedOrganization = localStorage.getItem("Organisation");
        const storedEmail = localStorage.getItem("email");
        setUsername(storedUsername);
        setOrganization(storedOrganization);
        setEmail(storedEmail);

        fetchData();
        setShowPreview(true);
      }
    }, [navigate]);

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth >= 1000);
      };

      handleResize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);

    useEffect(() => {
      if (uploadSuccess) {
        setSnackbarOpen(true);
        setTimeout(() => setUploadSuccess(false), 5000);
      }
    }, [uploadSuccess]);

    const fetchData = async () => {
      try {
        const storedUsername = localStorage.getItem("UserName");
        const storedOrganization = localStorage.getItem("Organisation");
        const response = await fetch(`${PortURL}/data?username=${storedUsername}&organization=${storedOrganization}`);
        if (response.ok) {
          const excelData = await response.json();
          setRetriveData(excelData);
          console.log(excelData);
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    const onDrop = useCallback((acceptedFiles) => {
      setData([]);
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          try {
            const workbook = XLSX.read(data, { type: "buffer", cellDates: true });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, {
              header: 1,
              dateNF: "yyyy-mm-dd hh:mm:ss",
            });
            const trimmedData = jsonData.filter((row) =>
              row.some((cell) => cell !== null && cell !== "")
            );
            const header = trimmedData.shift();
            const newJsonData = trimmedData.map((row) => {
              const obj = {};
              header.forEach((key, index) => {
                obj[key] = row[index];
              });
              return obj;
            });
            setData((prevData) => [...prevData, ...newJsonData]);
            setUploadedFileName(file.name);
          } catch (error) {
            console.error("Error reading file:", error);
          }
        };
        reader.readAsArrayBuffer(file);
      });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const filteredData = retriveData.filter((row) => {
      return Object.values(row || {}).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };

    const handleEdit = (rowId) => {
      console.log("Editing row with ID:", rowId);
      // Set the edited row ID
      setEditedRowId(rowId);
      // Set the edited row data
      setEditedRowData(filteredData[rowId]);
    };

    const handleCancel = () => {
      console.log("Canceling edit for row:", editedRowId);
      setEditedRowId(null);
    };

    const handleInputChange = (e, key) => {
      const { value } = e.target;
      console.log("Key:", key);
      console.log("Value:", value);
      // Update the edited row data with the new value
      setEditedRowData((prevData) => ({
        ...prevData,
        [String(key)]: String(value || ""), // Convert both key and value to strings and provide a fallback value of an empty string if value is null or undefined
      }));
    };

    const handleLogout = () => {
      // Show the confirmation modal
      setShowConfirmation(true);
    };

    
    const handleConfirmLogout = () => {
      // Perform logout logic
      localStorage.removeItem("sessionId");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("UserName");
      localStorage.removeItem("email");
      localStorage.removeItem("Organisation");
      navigate("/login");
    };

    const handleCloseConfirmation = () => {
      // Hide the confirmation modal
      setShowConfirmation(false);
    };

   


    const formatMonthYear = (dateString) => {
      const date = new Date(dateString);
      // Add 10 seconds to the date
      date.setSeconds(date.getSeconds() + 100);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear().toString().substr(-2);
      return `${month.toUpperCase()} ${year}`;
    };
    
// Modify the function used to render the date cell
const formatDateCell = (value, key) => {
  // Check if the key is "MonthYear"
  if (key === "MonthYear") {
    // Format the date using the formatMonthYear function
    return formatMonthYear(value);
  }
  // Return the value as is for other keys
  return value;
};




const handleSubmit = async () => {
  // Check if the data array is empty
  if (data.length === 0) {
    setSnackbarOpen(true);
    setSnackbarMessage("File is empty");
    setSnackbarColor("error");
    return; // Exit the function early if the data array is empty
  }

  setLoading(true); // Set loading state to true

  try {
    // Get session ID and organization from local storage
    const sessionId = localStorage.getItem('sessionId');
    const email = localStorage.getItem('email');

    // Create userData object with username and organization
    const userData = {
      username: username,
      organization: organization,
      email:email
    };

    // Map through the data array to format dates if needed
    const updatedData = data.map((row) => {
      if (row["Month/Year"]) {
        const dateString = row["Month/Year"].toString();
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = "00";
        const formattedDate = `${year}-${month}-${day}' '${hours}:${minutes}:${seconds}`;
        row["Month/Year"] = formattedDate;
      }
      return row;
    });

    // Delay execution for 2 seconds (for demonstration purposes)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Send POST request to the server
    const response = await fetch(`${PortURL}/bulk-upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Session-ID": sessionId, 
        "Email": email, 
      },
      body: JSON.stringify({ userData, data: updatedData }),
    });

    if (response.ok) {
      // Reset state and display success message
      setData([]);
      fetchData();
      const jsonResponse = await response.json();
      console.log(jsonResponse);

      setUploadSuccess(true); 
      setUploadedFileName("");
      setSnackbarMessage("Data uploaded successfully");
      setSnackbarColor("success");
    } else {
      // Display error message
      console.error("Error:", response.statusText);
      setSnackbarOpen(true);
      setSnackbarMessage("Data upload failed");
      setSnackbarColor("error");
    }
  } catch (error) {
    // Display error message
    console.error("Error:", error);
    setSnackbarOpen(true);
    setSnackbarMessage("Data upload failed");
    setSnackbarColor("error");
  }

  setLoading(false); // Set loading state to false
};


    const handleCheckboxChange = (rowId) => {
      if (rowId === null) {
        // Toggle selection for all rows
        const allRowIds = filteredData.map((_, index) => index);
        setSelectedRowIds(
          selectedRowIds.length === allRowIds.length ? [] : allRowIds
        );
      } else {
        // Toggle selection for a specific row
        setSelectedRowIds(
          selectedRowIds.includes(rowId)
            ? selectedRowIds.filter((id) => id !== rowId)
            : [...selectedRowIds, rowId]
        );
      }
    };

    const handleSave = async () => {
      try {
        console.log("Edit saved data", editedRowData);
        const sessionId = localStorage.getItem('sessionId');
        const email = localStorage.getItem('email');
        // Format the MonthYear date to "YYYY-MM-DD"
        const monthYearDate = new Date(editedRowData.MonthYear);
        const formattedMonthYear = `${monthYearDate.getFullYear()}-${(
          monthYearDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${monthYearDate
          .getDate()
          .toString()
          .padStart(2, "0")}`;

        // Create the payload with the updated MonthYear format
        const payload = {
          editedRow: {
            ...editedRowData,
            MonthYear: formattedMonthYear,
          },
        };

        // Send the updated data to the server

        const response = await fetch(`${PortURL}/update`, {
          method: "POST", // Change the method to POST since you're sending data
          headers: {
            "Content-Type": "application/json",
            
            "Session-ID": sessionId, 
            "Email": email, 
          },
          body: JSON.stringify(payload), // Send only the edited row data
        });

        if (response.ok) {
          console.log("Row updated successfully:", editedRowData);
          // Optionally, you can refresh the data from the server
          fetchData();
          setSnackbarOpen(true);
          setSnackbarMessage("Row updated successfully");
          setSnackbarColor("success"); 

          setEditedRowId(null); // Reset edited row id after saving
        } else {
          console.error("Error updating row:", response.statusText);
          setSnackbarOpen(true);
          setSnackbarMessage("Error updating row");
          setSnackbarColor("error"); // Set snackbar color to red

        }
      } catch (error) {
        console.error("Error updating row:", error);
        setSnackbarOpen(true);
        setSnackbarMessage("Error updating row");
        setSnackbarColor("error"); // Set snackbar color to red

      }
    };

    const handleDelete = async (rowId) => {
      try {
        console.log("Row ID:", rowId);
        const sessionId = localStorage.getItem('sessionId');
        const email = localStorage.getItem('email');
        
        console.log("Filtered Data:", filteredData);
    
        const identifierToDelete = String(filteredData[rowId]?.ID);
        console.log("Identifier to Delete:", identifierToDelete);
    
        const response = await fetch(`${PortURL}/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Session-ID": sessionId, 
            "Email": email, 
          },
          body: JSON.stringify({ ids: [identifierToDelete] }),
        });

        
        if (response.ok) {
          // If the deletion is successful, update the data state to reflect the changes
          const updatedData = filteredData.filter((row, index) => index !== rowId);
          setRetriveData(updatedData); // Update filteredData state with the updatedData
          setSnackbarOpen(true);
          setSnackbarMessage("Row deleted successfully");
        } else {
          console.error("Error deleting row:", response.statusText);
          setSnackbarOpen(true);
          setSnackbarMessage("Error deleting row");
        }
      } catch (error) {
        console.error("Error deleting row:", error);
        setSnackbarOpen(true);
        setSnackbarMessage("Error deleting row");
      }
    };
    

    const handleCloseSnackbar = () => {
      setSnackbarOpen(false);
      setSnackbarMessage("");
    };

    return (
      <div className="dashboard-container">
          <CustomSnackbar
          open={snackbarOpen}
          message={snackbarMessage}
          onClose={handleCloseSnackbar}
          color={snackbarColor}      />

        <Navbar bg="light" expand="lg" className="w-100">
        <a href="/login" className="brand-wrapper">
        <Link to="/dashboard" className="customNavbarBrand"></Link>
      </a>
          <NavbarToggle aria-controls="basic-navbar-nav" />
          <NavbarCollapse id="basic-navbar-nav">
            <Nav className="ml-auto align-items-center">
            
              {isMobile ? (
                <Dropdown className="d-flex username">
                  
            
                  <Dropdown.Toggle
                    id="dropdown-basic"
                    as="div"
                    className="customDropdown"
                  >
                    <div className="username-container">{username}
                  <FontAwesomeIcon className="username" icon={faUser} />
    </div>
                  </Dropdown.Toggle>

                  
                  <Dropdown.Menu>
                    <PopUpContainer>
                      <ResetNewPassword  />
                    </PopUpContainer>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
              
                
              
                  <React.Fragment >
                    <div className="smallscreen">

                  <div className="ml-auto align-items-center user ">
                    <FontAwesomeIcon icon={faUser} /> {username}
                  </div>
                  <PopUpContainer  >
                    <ResetPassword />
                  </PopUpContainer> 
                  <Dropdown.Item onClick={handleLogout} className="logout">Logout</Dropdown.Item>
                  </div>


                </React.Fragment>
              )}
            </Nav>
          </NavbarCollapse>
        </Navbar>

        <ConfirmationModal
          show={showConfirmation}
          onHide={handleCloseConfirmation}
          onConfirm={handleConfirmLogout}
          message="Are you sure you want to log out?"
        />

      

  <Container fluid className="container-fluid mt-4">

    <Form className="border shadow p-3 d-flex flex-column flex-lg-row">
      <div className="search-wrapper col-lg-6 mb-3 mb-lg-0">
        <FormControl
          className="search-input"
          type="text"
          placeholder="Search"
          style={{ flex: "1" }}
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="spacer"></div>
    
      <div className="filename mr-3 col-lg-2 mb-3 ">
        {uploadedFileName ? (
          <div className="d-flex align-items-center">
            <p className="mb-0">{`File: ${uploadedFileName}`}</p>
            <FontAwesomeIcon
              icon={faTimes} // Cancel icon
              className="ml-2 cancel-icon"
              onClick={() => setUploadedFileName("")} // onClick handler to clear uploadedFileName
            />
          </div>
        ) : (
          <p className="mb-0">No file uploaded</p>
        )}
      </div>
      <div className="spacer"></div>

      <div className="custom-file-upload d-flex">
        
        <div {...getRootProps()} className="Upload ">
          <input {...getInputProps()} accept=".xlsx, .xls" />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <Button className="btn btn-secondary btn-sm  Upload">
              <FontAwesomeIcon  className="clearicon" icon={faUpload} />
              Upload 
            </Button>
          )}
        </div>
        <div className="spacer"></div>

        <Button className="btn  btn-secondary submit" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </Form>
  </Container>
  {loading && (
    <div className="loading-spinner"></div>
  )}
      {loading && <LoadingSpinner />}

{filteredData.length === 0 ? (
        <div className="no-data-message">No data available</div>
      ) :
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
                <th key={key}>
                  {key === 'MonthYear' ? 'Date' : key}
                </th>
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
                        value={editedRowData[key] || ""}
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
                        className="btn  btn-sm Save"
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
                        className="btn  btn-sm Edit"
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

    
  }
        {loading && <LoadingSpinner />} 
      </div>
    );
  }

  export default Dashboard;
  