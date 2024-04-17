import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateInput = ({ value, onChange, placeholder }) => {
  return (
    <DatePicker
      selected={value}
      onChange={onChange}
      placeholderText={placeholder}
      dateFormat="MMM-yy" // Custom date format
      showMonthYearPicker // Display only month and year
      className="form-control" // Bootstrap form-control class
    />
  );
};

export default DateInput;
