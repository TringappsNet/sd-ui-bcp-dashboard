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
  Dropdown,
} from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
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
import ResetPassword from "./resetPassword";
import CustomSnackbar from "./Snackbar";
import { PortURL } from "./Config";



function Dashboard() {
  const [username, setUsername] = useState("");
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editedRowId, setEditedRowId] = useState(null); // Track edited row ID
  const [editedRowData, setEditedRowData] = useState({}); // Track edited row data

  const [organization, setOrganization] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState([]); // Track selected row IDs
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [retriveData, setRetriveData] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [navbarCollapsed, setNavbarCollapsed] = useState(false); // Track Navbar collapse state

  const navigate = useNavigate();

  
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      const storedUsername = localStorage.getItem("username");
      const storedOrganization = localStorage.getItem("Organisation");
      setUsername(storedUsername);
      setOrganization(storedOrganization);
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
      const response = await fetch(`${PortURL}/data`);
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
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const handleInvite = () => {
    navigate("/send-invite");
  };

  const formatDateHeading = (header) => {
    const dateParts = header.match(/\b(\w{3} \d{2})\b/);
    return dateParts ? dateParts[0] : header;
  };

  const formatDateCell = (value, columnName) => {
    if (typeof value === "string" && columnName === "Month/Year") {
      const [month, year] = value.split("/");
      const monthAbbreviation = month.substr(0, 3);
      return `${monthAbbreviation}-${year}`;
    } else if (value instanceof Date) {
      const month = value.toLocaleDateString("en-US", { month: "short" });
      const year = value.getFullYear().toString().slice(-2);
      return `${month}${year}`;
    }
    return value;
  };

  const handleSubmit = async () => {
    try {
      const userData = {
        username: username,
        organization: organization,
      };
      console.log("userData:", userData);
      console.log("Uploaded data:", data);
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
      const response = await fetch(`${PortURL}/bulk-upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData, data: updatedData }),
      });
      if (response.ok) {
        setData([]);
        fetchData();
        const jsonResponse = await response.json();
        console.log(jsonResponse);
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
        },
        body: JSON.stringify(payload), // Send only the edited row data
      });

      if (response.ok) {
        console.log("Row updated successfully:", editedRowData);
        // Optionally, you can refresh the data from the server
        fetchData();
        setSnackbarOpen(true);
        setSnackbarMessage("Row updated successfully");
        setEditedRowId(null); // Reset edited row id after saving
      } else {
        console.error("Error updating row:", response.statusText);
        setSnackbarOpen(true);
        setSnackbarMessage("Error updating row");
      }
    } catch (error) {
      console.error("Error updating row:", error);
      setSnackbarOpen(true);
      setSnackbarMessage("Error updating row");
    }
  };

  const handleDelete = async (rowId) => {
    try {
      console.log("Row ID:", rowId);

      console.log("Filtered Data:", filteredData);

      const identifierToDelete = String(filteredData[rowId]?.ID); // Convert identifierToDelete to string
      console.log("Identifier to Delete:", identifierToDelete);

      const response = await fetch(`${PortURL}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: [identifierToDelete] }), // Both key and value are string
      });
      if (response.ok) {
        // If the deletion is successful, update the data state to reflect the changes
        const updatedData = retriveData.filter((row) => row.id !== rowId);
        setRetriveData(updatedData);
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
      <Navbar bg="light" expand="lg" className="w-100">
        <div className="brand-wrapper">
          <NavbarBrand href="#home">
            <img src="/images/bcp2.png" alt="Logo" className="customLogo" />
          </NavbarBrand>
        </div>
        <NavbarToggle aria-controls="basic-navbar-nav" />
        <NavbarCollapse id="basic-navbar-nav">
          <Nav className="ml-auto align-items-center">
            {/* Render username inside dropdown menu if isMobile is true */}
            {isMobile ? (
              <Dropdown className="d-flex">
                <Dropdown.Toggle
                  id="dropdown-basic"
                  as="div"
                  className="customDropdown"
                >
                  <FontAwesomeIcon className="username" icon={faUser} /> {username}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <PopUpContainer>
                    <ResetPassword  />
                  </PopUpContainer>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              // Render the PopUpContainer directly if not mobile
              
             
              <React.Fragment >
                <div className="smallscreen">

              <div className="ml-auto align-items-center user ">
                <FontAwesomeIcon icon={faUser} /> {username}
              </div>
              <PopUpContainer className="popUp" >
                <ResetPassword className="popUp" />
              </PopUpContainer> 
              <Dropdown.Item onClick={handleLogout} className="logout">Logout</Dropdown.Item>
              </div>

            </React.Fragment>
            )}
          </Nav>
        </NavbarCollapse>
      </Navbar>

      <Container fluid>
        <div className="container-fluid full-height mt-5">
          <div className="row">
            <div className="col">
              <div className="border shadow p-3 d-flex justify-content-between align-items-center ">
                <Form className="d-flex ">
                  <div className="search-wrapper mr-2">
                    {/* <div className="search-icon">
                      <FontAwesomeIcon icon={faSearch} />
                    </div> */}
                    <FormControl
                      className="search-input"
                      type="text"
                      placeholder="Search"
                      style={{ flex: "1" }}
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>

                  <div {...getRootProps()} className="custom-file-upload ">
                    <input {...getInputProps()} accept=".xlsx, .xls" />
                    {isDragActive ? (
                      <p>Drop the files here ...</p>
                    ) : (
                      <Button className="btn btn-secondary btn-sm upload">
                        <FontAwesomeIcon icon={faUpload} />
                        Upload File
                      </Button>
                    )}
                  </div>
                </Form>
                <div className="ml-4 ">
                  <Button
                    className="mr-2 btn btn-secondary submit"
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                  <Button className="clear" variant="danger">
                    {" "}
                    Clear{" "}
                    <FontAwesomeIcon className="clearicon" icon={faTrash} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <br />
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={handleCloseSnackbar}
      />
      <Container fluid >
        <Row className="row Render-Row">
          <Col className="col Render-Col">
            <div className="table-responsive render">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th className="selection-cell">
                      <input
                        type="checkbox"
                        checked={selectedRowIds.length === filteredData.length}
                        onChange={() => handleCheckboxChange(null)}
                      />
                    </th>
                    {Object.keys(filteredData[0] || {}).map((key) => (
                      <th key={key}>{formatDateHeading(key)}</th>
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
    </div>
  );
}

export default Dashboard;
