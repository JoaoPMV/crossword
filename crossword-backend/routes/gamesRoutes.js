const express = require("express");
const router = express.Router();
const gameService = require("../services/gameService");
const { authMiddleware } = require("../middlewares/authMiddleware");

// Aplica o middleware a todas as rotas deste router
router.use(authMiddleware);

// Rota para listar todos os jogos
router.get("/", async (req, res) => {
  try {
    const games = await gameService.getAllGames();

    res.status(200).json(games);
  } catch (error) {
    console.error("Erro ao buscar jogos no backend:", error.message); // Exibe o erro no console
    res.status(500).json({ error: error.message }); // Retorna erro ao cliente
  }
});

// Rota para obter um jogo por slug
router.get("/games/:slug", async (req, res) => {
  try {
    const game = await gameService.getGameBySlug(req.params.slug);
    res.status(200).json(game);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

// Rota para atualizar um jogo
router.put("/games/:slug", async (req, res) => {
  try {
    const updatedGame = await gameService.updateGame(req.params.slug, req.body);
    res.status(200).json(updatedGame);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rota para excluir um jogo
router.delete("/games/:slug", async (req, res) => {
  try {
    const message = await gameService.deleteGame(req.params.slug);
    res.status(200).json(message);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

module.exports = router;
