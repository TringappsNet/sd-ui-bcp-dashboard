  import React, { useState, useCallback, useEffect } from "react";
  //import {Link } from "react-router-dom";

  //import { Table } from "react-bootstrap";
  import {
    Button,
    Form,
    FormControl,
    Container, } from "react-bootstrap";
  import { useDropzone } from "react-dropzone";
  import { useNavigate} from "react-router-dom";
  import * as XLSX from "xlsx";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import {
    faTimes,
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
  import NavbarComponent from "./Navbar";
  import ExcelGrid from './ExcelGrid';
  import columnMap from "../Objects/Objects";

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
    const [sessionExpired, setSessionExpired] = useState(false); // Track session expiration
    const [remainingTime, setRemainingTime] = useState(500); // 60 seconds for one minute
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [snackbarVariant, setSnackbarVariant] = useState('success');
    const [roleID, setRoleID] = useState('');

    const navigate = useNavigate();
   
    
    useEffect(() => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (!isLoggedIn) {
        navigate("/login");
      } else {
        const storedUsername = localStorage.getItem("UserName");
        const storedOrganization = localStorage.getItem("Organization");
        const storedEmail = localStorage.getItem("email");
        const storedRoleID = localStorage.getItem('Role_ID');
        setUsername(storedUsername);
        setOrganization(storedOrganization);
        setRoleID(storedRoleID);
        setEmail(storedEmail);

        fetchData();
        setShowPreview(true);
      }
    }, [navigate]);

    useEffect(() => {
      // Set up a timer to decrement remainingTime every second
      const timer = setInterval(() => {
        setRemainingTime((prevTime) => {
          if (prevTime <= 0) {
            // Session expired, trigger logout
            clearInterval(timer);
            handleLogout();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
  
      // Clean up timer on component unmount
      return () => clearInterval(timer);
    }, []);
  
    useEffect(() => {
      if (remainingTime === 0) {
        // Session expired, redirect to login page
        handleLogout(); // Or any other logout logic you have
        navigate("/login");
      }
    }, [remainingTime]);
  

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
        setLoading(true); 
        const storedUsername = localStorage.getItem("UserName");
        const storedOrganization = localStorage.getItem("Organization");
        const response = await fetch(`${PortURL}/data?username=${storedUsername}&organization=${storedOrganization}`);
        if (response.ok) {
          const excelData = await response.json();
          setRetriveData(excelData);
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false); 

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
            const mappedHeader = header.map((col) => columnMap[col] || col);
            const newJsonData = trimmedData.map((row) => {
              const obj = {};
              mappedHeader.forEach((key, index) => {
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
      // Set the edited row ID
      setEditedRowId(rowId);
      // Set the edited row data
      setEditedRowData(filteredData[rowId]);
    };

    const handleCancel = () => {
      setEditedRowId(null);
    };

    const handleInputChange = (e, key) => {
      const { value } = e.target;
      setEditedRowData((prevData) => ({
        ...prevData,
        [String(key)]: String(value || ""), // Convert both key and value to strings and provide a fallback value of an empty string if value is null or undefined
      }));
    };

    const handleLogout = () => {
      // Show the confirmation modal
      // For example, clear localStorage, reset state, etc.
        localStorage.removeItem("sessionId");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("UserName");
        localStorage.removeItem("email");
        localStorage.removeItem("Organization");
        localStorage.removeItem("createdAt");
      setShowConfirmation(true);
    };

    const handleLogoutModalClose = () => {
      setLogoutModalOpen(false);
    };
  
    const handleLogoutModalConfirm = () => {
      handleLogout();
      setLogoutModalOpen(false);
    };
  
    const openLogoutModal = () => {
      setLogoutModalOpen(true);
    };
    
    const handleConfirmLogout = () => {
      // Perform logout logic
      localStorage.removeItem("sessionId");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("UserName");
      localStorage.removeItem("email");
      localStorage.removeItem("Organization");
      localStorage.removeItem("createdAt");
      localStorage.removeItem("Role_ID")

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
    setSnackbarVariant("error");
    return; // Exit the function early if the data array is empty
  }

  setLoading(true); 

  try {
    // Get session ID and organization from local storage
    const sessionId = localStorage.getItem('sessionId');
    const email = localStorage.getItem('email');
    // const organization = localStorage.getItem('Organisation');
    const Role_ID = localStorage.getItem('Role_ID');
    const Org_ID = localStorage.getItem('Org_ID');
    const userId = localStorage.getItem('userId');


    // Create userData object with username and organization
    const userData = {
      username: username,
      orgID: Org_ID ,
      email: email,
      roleID: Role_ID,
      userId: userId
    };

    // Map through the data array to format dates if needed
    const updatedData = data.map((row) => {
      if (row["MonthYear"]) {
        const dateString = row["MonthYear"].toString();
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const seconds = "00";
        const formattedDate = `${year}-${month}-${day}' '${hours}:${minutes}:${seconds}`;
        row["MonthYear"] = formattedDate;
      }
      return row;
    });

    // Delay execution for 2 seconds (for demonstration purposes)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Send POST request to the server
    const response = await fetch(`${PortURL}/bulk-upload-update`, {
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

      setUploadSuccess(true); 
      setUploadedFileName("");
      setSnackbarMessage("Data uploaded successfully");
      setSnackbarVariant("success");
    } else {
      // Display error message
      console.error("Error:", response.statusText);
      setSnackbarOpen(true);
      setSnackbarMessage("Data upload failed");
      setSnackbarVariant("error");
    }
  } catch (error) {
    // Display error message
    console.error("Error:", error);
    setSnackbarOpen(true);
    setSnackbarMessage("Data upload failed");
    setSnackbarVariant("error");
  }

  setLoading(false);
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
        const sessionId = localStorage.getItem('sessionId');
        const email = localStorage.getItem('email');
        const userId = localStorage.getItem('userId');
        const Org_ID = localStorage.getItem('Org_ID');


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

          },email, userId, Org_ID
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
          fetchData();
          setSnackbarOpen(true);
          setSnackbarMessage("Row updated successfully");
          setSnackbarVariant("success"); 

          setEditedRowId(null); // Reset edited row id after saving
        } else {
          console.error("Error updating row:", response.statusText);
          setSnackbarOpen(true);
          setSnackbarMessage("Error updating row");
          setSnackbarVariant("error"); // Set snackbar color to red

        }
      } catch (error) {
        console.error("Error updating row:", error);
        setSnackbarOpen(true);
        setSnackbarMessage("Error updating row");
        setSnackbarVariant("error"); // Set snackbar color to red

      }
    };

    const handleDelete = async (rowId) => {
      try {
        const sessionId = localStorage.getItem('sessionId');
        const email = localStorage.getItem('email');
        const userId = localStorage.getItem('userId');
        const Org_ID = localStorage.getItem('Org_ID');
        const identifierToDelete = String(filteredData[rowId]?.ID);
    
        const response = await fetch(`${PortURL}/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Session-ID": sessionId, 
            "Email": email, 
          },
          body: JSON.stringify({
            ids: [identifierToDelete],
            Org_Id: Org_ID,
            userId: userId
          }),
        });

        
        if (response.ok) {
          // If the deletion is successful, update the data state to reflect the changes
          const updatedData = filteredData.filter((row, index) => index !== rowId);
          setRetriveData(updatedData); // Update filteredData state with the updatedData
          setSnackbarOpen(true);
          setSnackbarMessage("Row deleted successfully");
          setSnackbarVariant('success');
        } else {
          console.error("Error deleting row:", response.statusText);
          setSnackbarOpen(true);
          setSnackbarMessage("Error deleting row");
          setSnackbarVariant('error');

        }
      } catch (error) {
        console.error("Error deleting row:", error);
        setSnackbarOpen(true);
        setSnackbarMessage("Error deleting row");
        setSnackbarVariant('error');

      }
    };
    

    const handleCloseSnackbar = () => {
      setSnackbarOpen(false);
      setSnackbarMessage("");
    };

    return (
      <div className="dashboard-container">
        <CustomSnackbar
        message={snackbarMessage}
        variant={snackbarVariant}
        onClose={handleCloseSnackbar}
        open={snackbarOpen}
  
        // color={snackColor}


      />
<NavbarComponent
    username={username}
    handleLogout={handleLogout}
    isMobile={isMobile}
  />
    
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

<div>
  {filteredData.length === 0 ? (
    <div className="no-results">
      {/* <img src="/images.png" alt="No results found" className="background-image" /> */}
      <p>No results found</p>
    </div>
  ) : (
    <ExcelGrid
      filteredData={filteredData}
      selectedRowIds={selectedRowIds}
      editedRowId={editedRowId}
      editedRowData={editedRowData}
      handleCheckboxChange={handleCheckboxChange}
      handleEdit={handleEdit}
      handleCancel={handleCancel}
      handleInputChange={handleInputChange}
      handleSave={handleSave}
      handleDelete={handleDelete}
      formatDateCell={formatDateCell}
      roleID={roleID}
    />
  )}
</div>


    {loading && <LoadingSpinner />} 
  </div>
);
}
  export default Dashboard;
  