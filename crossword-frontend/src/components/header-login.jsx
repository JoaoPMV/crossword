import React from "react";
import { Link } from "react-router-dom"; // <-- IMPORT AQUI!

const Header = () => {
  return (
    <div>
      <div className="header-crossword">
        <a href="/register">Sign Up</a>
      </div>
    </div>
  );
};

export default Header;
