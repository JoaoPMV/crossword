import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import { useAuth } from "../context/authContext"; // Importa o hook
import HeaderCrossword from "../components//header";
import FooterCrossword from "../components/footer";
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
      <HeaderCrossword />
      <div className="container-login-register">
        <div className="main-login-register">
          <p className="error-login">{message}</p>
          <form onSubmit={loginSubmit}>
            <div className="login-email">
              <input
                className="login-email-input"
                type="email"
                placeholder="Email"
                id="email"
                name="email"
                value={formData.email}
                onChange={loginData}
                required
              />
            </div>

            <div className="login-password">
              <input
                type="password"
                placeholder="Password"
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
                Sign In
              </button>
            </div>
          </form>
          <p className="paragraph-register-login">
            <a
              onClick={() => navigate("/register")}
              className="anchor-register"
            >
              Click here to sign up
            </a>
          </p>
        </div>
      </div>
      <FooterCrossword />
    </div>
  );
};

export default Login;
