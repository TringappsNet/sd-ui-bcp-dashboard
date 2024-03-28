

import React, { useState, useEffect } from "react";
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavbarToggle,
    NavbarCollapse,
    Dropdown,
  } from "react-bootstrap";
  import PopUpContainer from "./popup";
  import ResetPassword from "./resetPassword";
  import "../styles/dashboard.css";
  import { useNavigate } from "react-router-dom";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import {
    faSearch,
    faUser,
   
  } from "@fortawesome/free-solid-svg-icons";

 function NavbarSection() {

    const [isMobile, setIsMobile] = useState(false);
    const [username, setUsername] = useState("");
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

      const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        navigate("/login");
      };
      
  return (

<Navbar bg="light" expand="lg" className="w-100">
        <div className="brand-wrapper">
          <NavbarBrand href="#home">
            <img src="/images/bcp2.png" alt="Logo" className="customLogo" />
          </NavbarBrand>
        </div>
        <NavbarToggle aria-controls="basic-navbar-nav" />
        <NavbarCollapse id="basic-navbar-nav">
          <Nav className="ml-auto align-items-center">
            {isMobile ? (
              <Dropdown className="d-flex">
                <Dropdown.Toggle
                  id="dropdown-basic"
                  as="div"
                  className="customDropdown"
                >
                  <FontAwesomeIcon className="username" icon={faUser} /> USERNAME
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <PopUpContainer>
                    <ResetPassword  />
                  </PopUpContainer>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              
             
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
  )
}

export default NavbarSection;