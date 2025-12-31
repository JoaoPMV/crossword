import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { useAuth } from "../context/authContext"; // Importa o hook
import { FaGithub } from "react-icons/fa";
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
    <div>
      <div className="container-login-register">
        <header className="header-login-register">
          <a href="/register">Sign Up</a>
        </header>
        <main className="main-teste">
          <form onSubmit={loginSubmit} className="form-login">
            <p className="error-login">{message}</p>

            <input
              className=""
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              value={formData.email}
              onChange={loginData}
              required
            />

            <input
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              value={formData.password}
              onChange={loginData}
              required
            />

            <button type="submit" className="button-login-register">
              Sign In
            </button>
          </form>
        </main>
        <footer className="footer-login-register">
          <div className="dev-info">
            <p>
              <FaGithub className="git-icon" />
            </p>
            <p className="">JoãoP Dev</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Login;
