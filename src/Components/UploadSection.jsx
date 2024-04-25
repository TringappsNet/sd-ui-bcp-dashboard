import React from 'react';
import { Container, Form, FormControl, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';

const UploadSection = ({ roleID, uploadedFileName, setUploadedFileName, searchQuery, handleSearchChange, handleSubmit, getRootProps, getInputProps, isDragActive }) => {
  return (
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
          {roleID !== '3' && uploadedFileName ? (
            <div className="d-flex align-items-center">
              <p className="mb-0 overflow-hidden">{`File: ${uploadedFileName}`}</p>
              <FontAwesomeIcon
                icon={faTimes}
                className="ml-2 cancel-icon"
                onClick={() => setUploadedFileName("")}
              />
            </div>
          ) : (
            roleID !== '3' && <p className="mb-0"></p>
          )}
        </div>
        <div className="spacer"></div>
        {roleID !== '3' && (
          <div className="custom-file-upload d-flex">
            <div {...getRootProps()} className="Upload ">
              <input {...getInputProps()} accept=".xlsx, .xls" />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <Button className="btn btn-secondary btn-sm  Upload">
                  <FontAwesomeIcon className="clearicon" icon={faUpload} />
                  <span className="UploadText">Upload</span>
                </Button>
              )}
            </div>
            <div className="spacer"></div>
            {roleID !== '3' && (
              <Button className="btn  btn-secondary submit" onClick={handleSubmit}>
                Submit
              </Button>
            )}
          </div>
        )}
      </Form>
    </Container>
  );
};

export default UploadSection;
