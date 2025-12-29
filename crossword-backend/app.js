require("dotenv").config(); // Carrega variáveis do .env
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const gamesRoutes = require("./routes/gamesRoutes");
const progressRoutes = require("./routes/progressRoutes");

const app = express();
const PORT = 5000;

// Middleware para processar JSON
app.use(express.json());

// Middleware CORS (Permite requisições do frontend)
app.use(
  cors({
    origin: ["http://localhost:3000", "crossword-kappa.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Conecta ao MongoDB
connectDB();

// Rotas de jogos com prefixo "/api/games"
app.use("/api/games", gamesRoutes); // Adicionei as rotas de jogos
console.log("Rotas de jogos carregadas com sucesso");

// Rotas de usuários com prefixo "/api/users"
app.use("/api/users", userRoutes);
app.use("/progress", progressRoutes);

// Rota inicial
app.get("/", (req, res) => {
  res.send("Servidor está rodando!");
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
