import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { useAuth } from "../context/authContext"; // Importa o hook
import "./pages.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const { setUser } = useAuth(); // Pega a função do contexto
  const navigate = useNavigate();

  const loginData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();

    try {
      // Chama a função de login para obter a resposta da API
      const response = await loginUser(formData);

      if (response.token && response.user) {
        // Salva o token no localStorage
        localStorage.setItem("authToken", response.token);
        // Salva o user no contexto para acesso global no app
        setUser(response.user);

        setMessage("Login realizado com sucesso!");

        // Redireciona o usuário para a página do jogo
        navigate("/crossword");
      } else {
        setMessage("Nenhum token ou usuário recebido na resposta.");
      }
    } catch (error) {
      // Trata erros e exibe mensagem de erro ao usuário
      setMessage(error.message || "Erro ao fazer login.");
    }
  };

  return (
    <div className="container-login-register">
      <header className="header-crossword"></header>
      <div className="main-login-register">
        <div className="box-login-register">
          <h2 className="text-center">Login</h2>
          {message && <p>{message}</p>}
          <form onSubmit={loginSubmit}>
            <div className="login-email">
              <label htmlFor="email">Email:</label>
              <input
                className="login-email-input"
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={loginData}
                required
              />
            </div>

            <div className="login-password">
              <label htmlFor="password">Senha:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={loginData}
                required
                style={{ width: "100%", padding: "8px", marginTop: "5px" }}
              />
            </div>

            <div>
              <button type="submit" className="button-login-register">
                Login
              </button>
            </div>
          </form>
          <p className="paragraph-register-login">
            Para se registrar,{" "}
            <a
              onClick={() => navigate("/register")}
              className="anchor-register"
            >
              clique aqui
            </a>
          </p>
        </div>
      </div>
      <footer className="footer-crossword">HEADER</footer>
    </div>
  );
};

export default Login;
