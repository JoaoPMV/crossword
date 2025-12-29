import React from "react";
import { FaGithub } from "react-icons/fa";

const footer = () => {
  return (
    <div>
      <div className="footer-crossword">
        <div className="dev-info">
          <p>
            <FaGithub className="git-icon" />
          </p>

          <p className="">JoãoP Dev</p>
        </div>
      </div>
    </div>
  );
};

export default footer;
