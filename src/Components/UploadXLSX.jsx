// import React from 'react';
// import { Container, Form, FormControl, Button } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTimes, faUpload } from '@fortawesome/free-solid-svg-icons';
// import { useDropzone } from 'react-dropzone';

// const UploadXLSX = ({ searchQuery, handleSearchChange, uploadedFileName, setUploadedFileName, handleSubmit }) => {
//   const { getRootProps, getInputProps, isDragActive } = useDropzone();

//   return (
//     <Container fluid className="container-fluid mt-4">
//       <Form className="border shadow p-3 d-flex flex-column flex-lg-row">
//         <div className="search-wrapper col-lg-6 mb-3 mb-lg-0">
//           <FormControl
//             className="search-input"
//             type="text"
//             placeholder="Search"
//             style={{ flex: "1" }}
//             value={searchQuery}
//             onChange={handleSearchChange}
//           />
//         </div>
//         <div className="spacer"></div>

//         <div className="filename mr-3 col-lg-2 mb-3 ">
//           {uploadedFileName ? (
//             <div className="d-flex align-items-center">
//               <p className="mb-0">{`File: ${uploadedFileName}`}</p>
//               <FontAwesomeIcon
//                 icon={faTimes} // Cancel icon
//                 className="ml-2 cancel-icon"
//                 onClick={() => setUploadedFileName("")} // onClick handler to clear uploadedFileName
//               />
//             </div>
//           ) : (
//             <p className="mb-0">No file uploaded</p>
//           )}
//         </div>
//         <div className="spacer"></div>

//         <div className="custom-file-upload d-flex">
//           <div {...getRootProps()} className="Upload ">
//             <input {...getInputProps()} accept=".xlsx, .xls" />
//             {isDragActive ? (
//               <p>Drop the files here ...</p>
//             ) : (
//               <Button className="btn btn-secondary btn-sm  Upload">
//                 <FontAwesomeIcon className="clearicon" icon={faUpload} />
//                 Upload
//               </Button>
//             )}
//           </div>
//           <div className="spacer"></div>

//           <Button className="btn  btn-secondary submit" onClick={handleSubmit}>
//             Submit
//           </Button>
//         </div>
//       </Form>
//     </Container>
//   );
// };

// export default UploadXLSX;
