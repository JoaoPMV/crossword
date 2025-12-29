import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate
import { registerUser } from "../api"; // Função da API
import "./pages.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // Inicializa o hook para redirecionar

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(formData);

      setMessage("Registro concluído com sucesso!");

      navigate("/login");
    } catch (error) {
      console.error("Erro ao registrar o usuário:", error.message);
      setMessage(error.message || "Erro ao registrar o usuário.");
    }
  };

  return (
    <div className="container-login-register">
      <header className="header-crossword"></header>
      <div className="main-login-register">
        <div className="box-login-register">
          <h2 className="text-center">Registrar-se</h2>

          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Nome:</label>
              <input
                className="register-name-input"
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="email">Email:</label>
              <input
                className="register-email-input"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-password">
              <label htmlFor="password">Senha:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>

            <div>
              <button type="submit" className="button-login-register">
                Registrar-se
              </button>
              <div className="error-message">
                {message && <span>{message}</span>}
              </div>
            </div>
          </form>
          <p className="paragraph-register-login">
            Para fazer login,{" "}
            <a onClick={() => navigate("/login")} className="anchor-register">
              clique aqui
            </a>
          </p>
        </div>
      </div>
      <footer className="footer-crossword">HEADER</footer>
    </div>
  );
};

export default Register;
