import React from "react";
import { useAuth } from "../context/authContext";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom"; // <-- IMPORT AQUI!

const Header = () => {
  const { user } = useAuth();
  console.log("USER no Header:", user); // <-- ADICIONE AQUI
  return (
    <div>
      <div className="header-crossword">
        <div className="user-log">
          <p>
            <FaUserCircle className="user-icon" />
          </p>
          <p>{user ? user.name : "usuário"}</p>
        </div>

        <a href="/logout">Sair</a>
      </div>
    </div>
  );
};

export default Header;
