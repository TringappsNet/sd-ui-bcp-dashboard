import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/dashboard.css";
import CustomSnackbar from "./Snackbar";
import { PortURL } from "./Config";
import LoadingSpinner from "./LoadingSpinner";
import ConfirmationModal from "./ConfirmationModal";
import NavbarComponent from "./Navbar";
import ExcelGrid from "./ExcelGrid";
import {columnMap} from "../Objects/Objects";
// import AuditGrid from './Audit';
import UploadSection from "./UploadSection";

function Dashboard() {


    const [username, setUsername] = useState("");
    // const[role, setRole] = useState("");
    const [retriveData, setRetriveData] = useState([]);
    const [data, setData] = useState([]);
    // const [organization, setOrganization] = useState("");
    // const [email, setEmail] = useState("");

    const [searchQuery, setSearchQuery] = useState("");

    const [selectedRowIds, setSelectedRowIds] = useState([]); 
    const [editedRowId, setEditedRowId] = useState(null); 
    const [editedRowData, setEditedRowData] = useState({}); 
   
    const [isMobile, setIsMobile] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState("");
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [roleID, setRoleID] = useState('');
    const [rowToDelete, setRowToDelete] = useState(0);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarVariant, setSnackbarVariant] = useState('success');
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [loading, setLoading] = useState(false); 
    // const [showPreview, setShowPreview] = useState(false);

    const navigate = useNavigate();
   
    



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


    const fetchDataMemoized = useCallback(async () => {
      try {
        setLoading(true); 
        const storedUsername = localStorage.getItem("UserName");
        const storedOrganization = localStorage.getItem("Organization");
        const response = await fetch(`${PortURL}/data?username=${storedUsername}&organization=${storedOrganization}`);
        if (response.ok) {
          const excelData = await response.json();
          
          const modifiedData = excelData.map((row) => ({
            ...row,
            MonthYear: addOneMinuteToDate(row.MonthYear)
          }));
          
          setRetriveData(modifiedData); 
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }, []);
  
    useEffect(() => {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (!isLoggedIn) {
        navigate("/login");
      } else {
        const storedUsername = localStorage.getItem("UserName");
        const storedRoleID = localStorage.getItem('Role_ID');
        setUsername(storedUsername);
        setRoleID(storedRoleID);
        fetchDataMemoized();
      }
    }, [fetchDataMemoized, navigate]);

    const addOneMinuteToDate = (dateString) => {
      const date = new Date(dateString);
      date.setMinutes(date.getMinutes() + 1000);
      return date.toISOString(); 
    };
    
    
    const handleConfirm = () => {
      handleSubmit();
      setShowModal(false);
    };
  
    const handleCloseModal = () => {
      setData([]);
      setUploadedFileName("");
      setShowModal(false);
    };
    

    const onDrop = useCallback(async (acceptedFiles) => {
      setData([]);
      setLoading(true); 
    
      acceptedFiles.forEach(async (file) => {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
          setLoading(false); 
          setSnackbarOpen(true);
          setSnackbarMessage('File type not supported');
          setSnackbarVariant("error");
          return;
        }
    
        const reader = new FileReader();
        reader.onload = async (e) => {
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
    
            const updatedData = newJsonData.map((row) => {
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
            setData((prevData) => [...prevData, ...updatedData]);
            setUploadedFileName(file.name);
    
            // const Role_ID = localStorage.getItem('Role_ID');
            const Org_ID = localStorage.getItem('Org_ID');
            const userId = localStorage.getItem('user_ID');
            try {
                const response = await fetch(`${PortURL}/validate-duplicates`, {
    
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  userData: {
                    userId: userId,
                    Org_ID: Org_ID,
                  },
                  data: updatedData,
                }),
              });
              if (response.ok) {
                const responseData = await response.json();
                const hasDuplicates = responseData.hasDuplicates;
                if (hasDuplicates === true) {
                  setShowModal(true);
                  setLoading(false); 
                }else if(hasDuplicates === false){
                  setLoading(false); 
                }
              } else {
                console.error('Error:', response.statusText);
              }
            } catch (error) {
              console.error('Error calling validate API:', error);
            }
          } catch (error) {
            console.error("Error reading file:", error);
          }
        };
        reader.readAsArrayBuffer(file);
      });
    }, [setData, setUploadedFileName]);
    

const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    
// LOGOUT CODE

const handleLogout = () => {
  setShowConfirmation(true);
};

const handleConfirmLogout = () => {
  localStorage.removeItem("sessionId");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("UserName");
  localStorage.removeItem("email");
  localStorage.removeItem("Organization");
  localStorage.removeItem("createdAt");
  localStorage.removeItem("Org_ID");
  localStorage.removeItem("role");
  localStorage.removeItem("user_ID");

  navigate("/login");
};



const handleInputChange = (e, key) => {
  const { value } = e.target;
  setEditedRowData((prevData) => ({
    ...prevData,
    [String(key)]: String(value || ""), 
  }));
};

//SEARCH CODE

    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };




   


    const handleCloseConfirmation = () => {
      setShowConfirmation(false);
    };

   
    const formatMonthYear = (dateString) => {
      const date = new Date(dateString);
      date.setSeconds(date.getSeconds() + 100);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear().toString().substr(-2);
      return `${month.toUpperCase()} ${year}`;
    };
    
const formatDateCell = (value, key) => {
  if (key === "MonthYear") {
    return formatMonthYear(value);
  }
  return value;
};


const filteredData = retriveData.filter((row) => {
  return Object.keys(row || {}).some((key) => {
    if (key === 'MonthYear') {
      const monthYearValue = formatMonthYear(row[key]);
      return monthYearValue.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return row[key] && row[key].toString().toLowerCase().includes(searchQuery.toLowerCase());
  });
});


//CANCEL

const handleCancel = () => {
  setEditedRowId(null);
};


//SUBMIT

const handleSubmit = async () => {
  setUploadedFileName("");
  if (data.length === 0) {
    setSnackbarOpen(true);
    setSnackbarMessage("File is empty");
    setSnackbarVariant("error");
    return; 
  }

  setLoading(true); 

  try {
    const sessionId = localStorage.getItem('sessionId');
    const email = localStorage.getItem('email');
    const Role_ID = localStorage.getItem('Role_ID');
    const Org_ID = localStorage.getItem('Org_ID');
    const userId = localStorage.getItem('user_ID');
    const role = localStorage.getItem('role')

    const userData = {
      username: username,
      orgID: Org_ID ,
      email: email,
      roleID: Role_ID,
      userId: userId,
      role: role
    };

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await fetch(`${PortURL}/bulk-upload-update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Session-ID": sessionId, 
        "Email": email, 
      },
      body: JSON.stringify({ userData, data }),
    });

    if (response.ok) {
      setData([]);
      fetchDataMemoized();
      const jsonResponse = await response.json();

      setUploadSuccess(true); 
      setUploadedFileName("");
      setSnackbarMessage(jsonResponse.message);
      setSnackbarVariant("success");
    } else {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.message || "Data upload failed";
      console.error("Error:", errorMessage);
      setSnackbarOpen(true);
      setSnackbarMessage(errorMessage);
      setSnackbarVariant("error");
    }
  } catch (error) {
    console.error("Error:", error);
    setSnackbarOpen(true);
    setSnackbarMessage("Data upload failed");
    setSnackbarVariant("error");
  }

  setLoading(false);
};


//CHECKBOX


    const handleCheckboxChange = (rowId) => {
      if (rowId === null) {
        const allRowIds = filteredData.map((_, index) => index);
        setSelectedRowIds(
          selectedRowIds.length === allRowIds.length ? [] : allRowIds
        );
      } else {
        setSelectedRowIds(
          selectedRowIds.includes(rowId)
            ? selectedRowIds.filter((id) => id !== rowId)
            : [...selectedRowIds, rowId]
        );
      }
    };


    const handleUpdateValidation = async () => {
      setLoading(true);
      const email = localStorage.getItem('email');
      const Org_ID = localStorage.getItem('Org_ID');
      const userId = localStorage.getItem('user_ID');
      const monthYearDate = new Date(editedRowData.MonthYear);
      const formattedMonthYear = `${monthYearDate.getFullYear()}-${(
        monthYearDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${monthYearDate
        .getDate()
        .toString()
        .padStart(2, "0")}`;

      const payload = {
        editedRow: {
          ...editedRowData,
          MonthYear: formattedMonthYear,

        },email,Org_ID,userId      };

      try {
        const validateResponse = await fetch(`${PortURL}/validate-duplicates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userData: {
              userId: userId,
              Org_ID: Org_ID,
            },
            data: [payload.editedRow], 
          }),
        });
    
        if (validateResponse.ok) {
          const validationResult = await validateResponse.json();
          const hasDuplicates = validationResult.hasDuplicates;
          
          if (hasDuplicates === true) {
            setLoading(false);
            setShowUpdateModal(true);
          } else {
            setLoading(false);
            handleSave();
          }
        } else {
          console.error("Error validating duplicates:", validateResponse.statusText);
          setSnackbarOpen(true);
          setSnackbarMessage("Error validating duplicates");
          setSnackbarVariant("error");
        }
      } catch (error) {
        console.error("Error validating duplicates:", error);
        setSnackbarOpen(true);
        setSnackbarMessage("Error validating duplicates");
        setSnackbarVariant("error");
      }
    };
    
    const handleCloseUpdate = () => {
      setShowUpdateModal(false);
    };  


    //SAVE

    const handleSave = async () => {
      setLoading(true);
      try {
        const sessionId = localStorage.getItem('sessionId');
        const email = localStorage.getItem('email');
        const Org_ID = localStorage.getItem('Org_ID');
        const userId = localStorage.getItem('user_ID');
        const monthYearDate = new Date(editedRowData.MonthYear);
        const formattedMonthYear = `${monthYearDate.getFullYear()}-${(
          monthYearDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${monthYearDate
          .getDate()
          .toString()
          .padStart(2, "0")}`;

        const payload = {
          editedRow: {
            ...editedRowData,
            MonthYear: formattedMonthYear,

          },email,Org_ID,userId      };


        const response = await fetch(`${PortURL}/update`, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
            
            "Session-ID": sessionId, 
            "Email": email, 
          },
          body: JSON.stringify(payload), 
        });

        if (response.ok) {
          fetchDataMemoized();
          setSnackbarOpen(true);
          setSnackbarMessage("Row updated successfully");
          setSnackbarVariant("success"); 

          setEditedRowId(null); 
        } else {
          console.error("Error updating row:", response.statusText);
          setSnackbarOpen(true);
          setSnackbarMessage("Error updating row");
          setSnackbarVariant("error"); 

        }
      } catch (error) {
        console.error("Error updating row:", error);
        setSnackbarOpen(true);
        setSnackbarMessage("Error updating row");
        setSnackbarVariant("error");

      }
      setLoading(false);
      setShowUpdateModal(false);
    };
 

    const handleCloseDelete = () => {
      setShowDeleteModal(false);
    }


    const handleEdit = (rowId) => {
      setEditedRowId(rowId);
      setEditedRowData(filteredData[rowId]);
    };

    const handleDelete = (index,columnId) => {
      setRowToDelete(columnId);
      setShowDeleteModal(true);
    };
  
    const handleConfirmDelete = async () => {
      setShowDeleteModal(false);
      const rowId = rowToDelete;    
      try {
        const sessionId = localStorage.getItem('sessionId');
        const email = localStorage.getItem('email');
        const userId = localStorage.getItem('user_ID');
        const Org_ID = localStorage.getItem('Org_ID');


 const stringRow=String(rowId);
        const response = await fetch(`${PortURL}/delete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Session-ID": sessionId, 
            "Email": email, 
          },
          body: JSON.stringify({
            ids: [stringRow],
            Org_Id: Org_ID,
            userId: userId
          }),

        }); 

        
          if (response.ok) {

            fetchDataMemoized();   
           const updatedData=retriveData ;        
        
          setRetriveData(updatedData); 
          setSnackbarOpen(true);
          setSnackbarMessage("Row deleted successfully");
          setSnackbarVariant('success');
          setShowDeleteModal(false);

        } else {
          console.error("Error deleting row:", response.statusText);
          setSnackbarOpen(true);
          setSnackbarMessage("Error deleting row");
          setSnackbarVariant('error');
          setShowDeleteModal(false);

        }
      } catch (error) {
        console.error("Error deleting row:", error);
        setSnackbarOpen(true);
        setSnackbarMessage("Error deleting row");
        setSnackbarVariant('error');
        setShowDeleteModal(false);

      }
    };
    
    const handleCloseSnackbar = () => {
      setSnackbarOpen(false);
      setSnackbarMessage("");
    };

    // const columns = [
    //   { field: 'ID', headerName: 'ID', width: 90 },
    //   { field: 'MonthYear', headerName: 'MonthYear', width: 200 },
    //   { field: 'CompanyName', headerName: 'Company Name', width: 200 },
    //   { field: 'RevenueActual', headerName: 'Revenue Actual', width: 150 },
    //   { field: 'RevenueBudget', headerName: 'Revenue Budget', width: 150 },
    //   { field: 'GrossProfitActual', headerName: 'Gross Profit Actual', width: 180 },
    //   { field: 'GrossProfitBudget', headerName: 'Gross Profit Budget', width: 180 },
    //   { field: 'SGAActual', headerName: 'SGA Actual', width: 120 },
    //   { field: 'SGABudget', headerName: 'SGA Budget', width: 120 },
    //   { field: 'EBITDAActual', headerName: 'EBITDA Actual', width: 150 },
    //   { field: 'EBITDABudget', headerName: 'EBITDA Budget', width: 150 },
    //   { field: 'CapExActual', headerName: 'CapEx Actual', width: 150 },
    //   { field: 'CapExBudget', headerName: 'CapEx Budget', width: 150 },
    //   { field: 'FixedAssetsNetActual', headerName: 'Fixed Assets Net Actual', width: 200 },
    //   { field: 'FixedAssetsNetBudget', headerName: 'Fixed Assets Net Budget', width: 200 },
    //   { field: 'CashActual', headerName: 'Cash Actual', width: 150 },
    //   { field: 'CashBudget', headerName: 'Cash Budget', width: 150 },
    //   { field: 'TotalDebtActual', headerName: 'Total Debt Actual', width: 180 },
    //   { field: 'TotalDebtBudget', headerName: 'Total Debt Budget', width: 180 },
    //   { field: 'AccountsReceivableActual', headerName: 'Accounts Receivable Actual', width: 220 },
    //   { field: 'AccountsReceivableBudget', headerName: 'Accounts Receivable Budget', width: 220 },
    //   { field: 'AccountsPayableActual', headerName: 'Accounts Payable Actual', width: 220 },
    //   { field: 'AccountsPayableBudget', headerName: 'Accounts Payable Budget', width: 220 },
    //   { field: 'InventoryActual', headerName: 'Inventory Actual', width: 150 },
    //   { field: 'InventoryBudget', headerName: 'Inventory Budget', width: 150 },
    //   { field: 'EmployeesActual', headerName: 'Employees Actual', width: 150 },
    //   { field: 'EmployeesBudget', headerName: 'Employees Budget', width: 150 },
    //   { field: 'Quarter', headerName: 'Quarter', width: 120 },
    // ];
    
    return (
      <div className="dashboard-container">

              <CustomSnackbar
              message={snackbarMessage}
              variant={snackbarVariant}
              onClose={handleCloseSnackbar}
              open={snackbarOpen}
            />
            
            <NavbarComponent
                username={username}
                handleLogout={handleLogout}
                isMobile={isMobile}
              />

          
              {/* Logout Confirmation popup */}

              <ConfirmationModal
              show={showConfirmation}
              onHide={handleCloseConfirmation}
              onConfirm={handleConfirmLogout}
              title="Confirm Action"
              cancelText="Close"
              confirmText="Logout"
              cancelVariant="secondary"
              confirmVariant="danger"
              message="Are you sure you want to log out?"
            />




              <UploadSection
                roleID={roleID}
                uploadedFileName={uploadedFileName}
                setUploadedFileName={setUploadedFileName}
                searchQuery={searchQuery}
                handleSearchChange={handleSearchChange}
                handleSubmit={handleSubmit}
                getRootProps={getRootProps}
                getInputProps={getInputProps}
                isDragActive={isDragActive}
                />




              {/* <div style={{ height: 400, width: '100%' }}>
                <AuditGrid
                  rows={retriveData}
                  columns={columns}
                  selectionModel={selectionModel}
                  onSelectionModelChange={setSelectionModel}
                />
              </div> */}

              <div>
                {filteredData.length === 0 ? (
                  <div className="no-results">
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
                    handleSave={handleUpdateValidation}
                    handleDelete={handleDelete}
                    formatDateCell={formatDateCell}
                    roleID={roleID}
                    setEditedRowData={setEditedRowData}
                    rowToDelete={rowToDelete}
                    setRowToDelete={setRowToDelete}
                    
                  />
                )}
              </div>


                  {/* Override Confirmation popup */}
                      <>
                      <ConfirmationModal
                            show={showModal}
                            onHide={handleCloseModal}
                            onConfirm={handleConfirm}
                            title="Confirm Override"
                            cancelText="No"
                            confirmText="Yes"
                            cancelVariant="secondary"
                            confirmVariant="danger"
                            message="Are you sure you want to override?"
                          />
                      </>

                      {/* Delete Confirmation popup */}
                      <>
                      <ConfirmationModal
                            show={showDeleteModal}
                            onHide={handleCloseDelete}
                            onConfirm={handleConfirmDelete}
                            title="Confirm Delete"
                            cancelText="No"
                            confirmText="Delete"
                            cancelVariant="secondary"
                            confirmVariant="danger"
                            message={`Are you sure you want to delete the row ${formatMonthYear(filteredData.find(row => row.ID === rowToDelete)?.MonthYear)}?`}
                            />
                      </>

                      {/* override Update popup */}
                      <>
                      <ConfirmationModal
                            show={showUpdateModal}
                            onHide={handleCloseUpdate}
                            onConfirm={handleSave}
                            title="Confirm Update"
                            cancelText="No"
                            confirmText="Update"
                            cancelVariant="secondary"
                            confirmVariant="danger"
                            message={`Are you sure you want to update?`}
                          />
                      </>


                      {loading && <LoadingSpinner />} 

                      
  </div>
);
}
  export default Dashboard;
  