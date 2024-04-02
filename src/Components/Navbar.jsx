// Navbar.js

import React from 'react';
import { Navbar, Nav, Dropdown, FormControl, Button,  NavbarToggle,
    NavbarCollapse, } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import PopUpContainer from "./popup";

const NavbarComponent = ({ username, handleLogout, isMobile }) => {
  return (
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
              <div className="username-container">
                {username}
                <FontAwesomeIcon className="username" icon={faUser} />
              </div>
            </Dropdown.Toggle>
  
            <Dropdown.Menu>
              <PopUpContainer>{/* <ResetNewPassword  /> */}</PopUpContainer>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <React.Fragment>
            <div className="smallscreen">
              <div className="ml-auto align-items-center user ">
                <FontAwesomeIcon icon={faUser} /> {username}
              </div>
              <PopUpContainer>
                {/* <ResetPassword /> */}
              </PopUpContainer>
              <Dropdown.Item onClick={handleLogout} className="logout">
                Logout
              </Dropdown.Item>
            </div>
          </React.Fragment>
        )}
      </Nav>
    </NavbarCollapse>
  </Navbar>
  
  );
};

export default NavbarComponent;
