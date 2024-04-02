import React, { useState,useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TextField, IconButton, Button } from '@material-ui/core';
// import '../styles/OrgPopup.css';
import ExcelGrid from './ExcelGrid';
import { PortURL } from "./Config";
import { useNavigate , Link
} from "react-router-dom";

const OrgPopup = ({ handleClose }) => {
  const [username, setUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [organization, setOrganization] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [retriveData, setRetriveData] = useState([]);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("success"); 

  const navigate = useNavigate();
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

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      const storedUsername = localStorage.getItem("UserName");
      const storedOrganization = localStorage.getItem("Organisation");
      setUsername(storedUsername);
      setOrganization(storedOrganization);
      fetchData();
      setShowPreview(true);
    }
  }, [navigate]);
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
  
  const formatMonthYear = (dateString) => {
    const date = new Date(dateString);
    // Add 10 seconds to the date
    date.setSeconds(date.getSeconds() + 100);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().substr(-2);
    return `${month.toUpperCase()} ${year}`;
  };
  const formatDateCell = (value, key) => {
    // Check if the key is "MonthYear"
    if (key === "MonthYear") {
      // Format the date using the formatMonthYear function
      return formatMonthYear(value);
    }
    // Return the value as is for other keys
    return value;
  };
  const [editedRowId, setEditedRowId] = useState(null); // Track edited row ID
  const [editedRowData, setEditedRowData] = useState({}); // Track edited row data
  const [selectedRowIds, setSelectedRowIds] = useState([]); // Track selected row IDs

  return (
    <div className="fullscreen-popup">
      <div className="popup-content">
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
      />
      </div>
    </div>
  );
};

export default OrgPopup;
