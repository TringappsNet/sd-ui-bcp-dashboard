import React, { useState, useEffect } from 'react';
import { PortURL } from "./Config";
import '../styles/ExcelGrid.css';
import ExcelGrid from './ExcelGrid'; // Import the ExcelGrid component

const OrgPop = ({ handleClose }) => {
  const [excelData, setExcelData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [editedRowId, setEditedRowId] = useState(null);
  const [editedOrgName, setEditedOrgName] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${PortURL}/users`);
      if (response.ok) {
        const data = await response.json();
        setExcelData(data);
        setFilteredData(data); // Initialize filtered data with all data
      } else {
        console.error('Failed to fetch Excel data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching Excel data:', error);
    }
  };

  const handleCheckboxChange = (index) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(row => row !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const handleEdit = (index) => {
    setEditedRowId(index);
    setEditedOrgName(filteredData[index].org_name);
  };

  const handleSave = async () => {
    try {
      const updatedData = [...excelData];
      updatedData[editedRowId].org_name = editedOrgName;
  
      // Perform API call to save updated data
      const response = await fetch(`${PortURL}/update-org`, {
        method: 'PUT',
        body: JSON.stringify({ org_id: updatedData[editedRowId].org_ID, new_org_name: editedOrgName }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        console.log('Organization updated successfully');
        // Update the local state or fetch data again to refresh the list
      } else {
        console.error('Failed to update organization:', response.statusText);
      }
  
      setExcelData(updatedData);
      setEditedRowId(null);
      setEditedOrgName('');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleDelete = async () => {
    try {
      // Iterate through selected rows and delete organizations
      for (const index of selectedRows) {
        const response = await fetch(`${PortURL}/delete-Org`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ org_ID: filteredData[index].org_ID }) // Include the organization ID in the request body
        });
        if (response.ok) {
          console.log('Organization deleted successfully. ID:', filteredData[index].org_ID);
          // Remove the deleted organization from the local state
          const updatedData = [...filteredData];
          updatedData.splice(index, 1);
          setFilteredData(updatedData);
        } else {
          console.error('Failed to delete organization:', response.statusText);
        }
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
    }
  };

  const formatDateCell = (data, key) => {
    // Implement your date formatting logic here
    return data; // For now, just return the data as is
  };

  return (
    <ExcelGrid
      filteredData={filteredData}
      selectedRowIds={selectedRows}
      editedRowId={editedRowId}
      editedRowData={{ org_name: editedOrgName }}
      handleCheckboxChange={handleCheckboxChange}
      handleEdit={handleEdit}
      handleSave={handleSave}
      handleDelete={handleDelete}
      formatDateCell={formatDateCell}
    />
  );
};

export default OrgPop;
