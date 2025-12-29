import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate
import { registerUser } from "../api"; // Função da API
import HeaderCrossword from "../components//header";
import FooterCrossword from "../components/footer";
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

      navigate("/");
    } catch (error) {
      console.error("Erro ao registrar o usuário:", error.message);
      setMessage(error.message || "Erro ao registrar o usuário.");
    }
  };

  return (
    <div>
      <HeaderCrossword />
      <div className="container-login-register">
        <header className="header-crossword"></header>
        <div className="main-login-register">
          <div className="box-login-register">
            <form onSubmit={handleSubmit}>
              <div className="error-message">
                {message && <span>{message}</span>}
              </div>
              <div>
                <input
                  className="register-name-input"
                  type="text"
                  placeholder="Name"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <input
                  className="register-email-input"
                  type="email"
                  placeholder="Email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="register-password">
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                />
              </div>

              <div>
                <button type="submit" className="button-login-register">
                  Sign Up
                </button>
              </div>
            </form>
            <p className="paragraph-register-login">
              <a onClick={() => navigate("/")} className="anchor-register">
                Click here to sign in
              </a>
            </p>
          </div>
        </div>
      </div>
      <FooterCrossword />
    </div>
  );
};

export default Register;
