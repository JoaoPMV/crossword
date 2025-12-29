const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const { authMiddleware } = require("../middlewares/authMiddleware");
const User = require("../models/User"); // ajuste o caminho conforme seu projeto

// Rota para criar um novo usuário
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await userService.createUser(name, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para listar todos os usuários
router.get("/list", async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rota para autenticação de usuário (login)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Valida as credenciais e retorna o usuário autenticado + token JWT
    const { user, token } = await userService.authenticateUser(email, password);

    // Retornar o token JWT e os dados do usuário no formato correto
    res.status(200).json({
      token, // Retorna o JWT gerado
      user: {
        id: user._id, // Apenas os campos necessários do usuário
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// GET /api/users/me
router.get("/me", authMiddleware, async (req, res) => {
  try {
    // Pegue o ID do usuário criado pelo middleware JWT
    const userId = req.user.id;
    // Busque no banco somente os campos desejados
    const user = await User.findById(userId).select("name email");
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    // Devolva nome, email e id
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

module.exports = router;
