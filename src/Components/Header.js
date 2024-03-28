import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/header.css';

function Header() {
  return (
    <header className="header">
      <Link to="/Login">
        <img src="/images/bcp.png" alt="Logo" className="logo" />
      </Link>
    </header>
  );
}

export default Header;