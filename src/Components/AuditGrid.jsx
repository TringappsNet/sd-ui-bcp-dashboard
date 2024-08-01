import React, { useState, useEffect, useRef } from 'react';
import { Table, Form } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { PortURL } from './Config';
import LoadingSpinner from './LoadingSpinner';
import '../styles/dashboard.css';
import '../styles/ExcelGrid.css';
import '../styles/auditGrid.css';



const AuditGrid = ({ handleClose }) => {
  const [auditData, setAuditData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'ModificationTime', direction: 'descending' });
  const [editedRowId] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [loading, setLoading] = useState(true); // Add loading state
  const [visibleRows, setVisibleRows] = useState([]);
  const rowsPerBatch = 1000; // Number of rows to load per batch
  const [currentBatch, setCurrentBatch] = useState(1);

  const isFetched = useRef(false);

  useEffect(() => {
    if (!isFetched.current) {
      fetchAuditData();
      isFetched.current = true;
    }
  }, []); 

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filterYear, auditData]);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector('.custom-scroll');
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 100) {
        loadMoreRows();
      }
    };

    const container = document.querySelector('.custom-scroll');
    container.addEventListener('scroll', handleScroll);

    return () => container.removeEventListener('scroll', handleScroll);
  }, [visibleRows, auditData]);

  const fetchAuditData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${PortURL}/Audit/get`);
      const data = await response.json();
      console.log('Fetched audit data:', data);
      setAuditData(data.flat());
      setFilteredData(data.flat());
      setVisibleRows(data.flat().slice(0, rowsPerBatch));
    } catch (error) {
      console.error('Error fetching audit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...auditData];

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter((item) =>
        Object.values(item).some((value) =>
          value &&
          (value.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            formatMonthYear(value).toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    }

    if (filterYear !== '') {
      filtered = filtered.filter((item) => {
        const modificationTime = new Date(item.ModificationTime);
        const year = modificationTime.getFullYear();
        return year === parseInt(filterYear);
      });
    }
    setFilteredData(filtered);
    setVisibleRows(filtered.slice(0, rowsPerBatch * currentBatch));
  };

  const loadMoreRows = () => {
    const newBatch = currentBatch + 1;
    const newVisibleRows = filteredData.slice(0, rowsPerBatch * newBatch);
    setVisibleRows(newVisibleRows);
    setCurrentBatch(newBatch);
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    if (sortConfig.key !== null) {
      const sorted = [...visibleRows].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      return sorted;
    }
    return visibleRows;
  };

  const formatMonthYear = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear().toString().substr(-2);
    return `${month}-${year}`;
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('default', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatNumber = (number) => {
    try{
      if (!number) return ''; // Handle empty or null values

      // Convert the number to a string
      let formattedNumber = number.toString();

      // Split the number into integer and decimal parts
      const parts = formattedNumber.split('.');
      
      // Format the integer part with commas
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      // Handle the decimal part

      if (parts[1] !== undefined && parts[1] !== null) {
        // Limit the decimal part to 2 digits
        parts[1]=parts[1].toString();
        parts[1] = parts[1].substring(0, 2);
      }
      // Join the integer and decimal parts with a period
      formattedNumber = parts.join('.');

      return formattedNumber;
    }
    catch(error){
      if (!number) return '';
      return number.toString();
      console.error('Error formatting number:', error);
    }
  };

  const auditColumnMap = {
    ModificationTime: 'Modified Time',
    ModifiedBy: 'Modified By',
    MonthYear: 'Month-Year',
    CompanyName: 'Company Name',
    RevenueActual: 'Revenue Actual',
    RevenueBudget: 'Revenue Budget',
    GrossProfitActual: 'Gross Profit Actual',
    GrossProfitBudget: 'Gross Profit Budget',
    SGAActual: 'SGA Actual',
    SGABudget: 'SGA Budget',
    EBITDAActual: 'EBITDA Actual',
    EBITDABudget: 'EBITDA Budget',
    CapExActual: 'CapEx Actual',
    CapExBudget: 'CapEx Budget',
    FixedAssetsNetActual: 'Fixed Assets Net Actual',
    FixedAssetsNetBudget: 'Fixed Assets Net Budget',
    CashActual: 'Cash Actual',
    CashBudget: 'Cash Budget',
    TotalDebtActual: 'Total Debt Actual',
    TotalDebtBudget: 'Total Debt Budget',
    AccountsReceivableActual: 'Accounts Receivable Actual',
    AccountsReceivableBudget: 'Accounts Receivable Budget',
    AccountsPayableActual: 'Accounts Payable Actual',
    AccountsPayableBudget: 'Accounts Payable Budget',
    InventoryActual: 'Inventory Actual',
    InventoryBudget: 'Inventory Budget',
    EmployeesActual: 'Employees Actual',
    EmployeesBudget: 'Employees Budget',
    Quarter: 'Quarter',
  };

  const renderTableHeaders = () => (
    <thead className="sticky-header">
      <tr>
      {Object.keys(auditColumnMap).map((key) => (
        key !== 'ID' && (
        <th key={key} onClick={() => requestSort(key)}>
            <span>{auditColumnMap[key]}</span>
        </th>
        )
       ))}
      </tr>
    </thead>
  );

  const renderTableBody = () => (
    <tbody>
    {visibleRows.length === 0 ? (
    <div className="no-results-audit">
    <p className='text-result'>No results found</p>
    </div>     
    ) : (
      visibleRows.map((row, index) => (
        <tr key={index}>
          {Object.keys(auditColumnMap).map((key) => (
            key !== 'ID' && (
              <td key={key} className={key === 'ModificationTime' || key === 'ModifiedBy' ? 'extra-space' : ''}>
                {renderCellContent(row, key, index)}
              </td>
            )
          ))}
        </tr>
      ))
    )}
  </tbody>
  );

  const renderCellContent = (row, key, index) => {
    if (editedRowId === index) {
      if (key === 'CompanyName') {
        return <span>{editedRowData[key]}</span>;
      } else if (key === 'MonthYear') {
        return <span>{formatMonthYear(row[key])}</span>;
      } else {
        return (
          <input
            type="text"
            className="GridInput"
            value={editedRowData[key] || ''}
            onChange={(e) => handleInputChange(e, key)}
          />
        );
      }
    } else {
      return (
        <span>
          {key === 'MonthYear' 
            ? formatMonthYear(row[key]) 
            : key === 'ModificationTime'
            ? formatDateTime(row[key])
            : formatNumber(row[key])
          }
        </span>
      );
    }
  };

  const handleInputChange = (e, key) => {
    const { value } = e.target;
    setEditedRowData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleYearFilter = (e) => {
    const selectedYear = e.target.value;
    setFilterYear(selectedYear);
  };

  return (
    <Container fluid className="audit-grid-container">
      <Row className="audit-header-container justify-content-between align-items-center ml-2">
        <Col>
          <h4 className='text-light'>Audit Data</h4>
        </Col>
        <Col className="text-right">
          <div className="close-audit text-light" onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </Col>
      </Row>
      <Container fluid className="container-fluid mt-2">
      <Row className="filter-container justify-content-between">
        <Col md={6} className="search-bar-audit">
          <Form.Control
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Col>
        <Col md={3} className="year-filter-audit">
        <Form.Control as="select" value={filterYear} onChange={handleYearFilter}>
            <option value="">Select Year</option>
            {Array.from(new Set(auditData.map((item) => {
            const modificationTime = new Date(item.ModificationTime);
            return modificationTime.getFullYear();
            }))).map((year) => (
            <option key={year} value={year}>{year}</option>
            ))}
        </Form.Control>
        <FontAwesomeIcon icon={faCaretDown} className="dropdown-icon-audit" />
        </Col>
      </Row>  
      </Container>  
      <Row className="table-audit">
        <Col className="custom-scroll">
          {loading ? ( 
            <LoadingSpinner />
          ) : (
            <Table striped bordered hover>
              {renderTableHeaders()}
              {renderTableBody()}
            </Table>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AuditGrid;
