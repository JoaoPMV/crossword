const express = require("express");
const mongoose = require("mongoose");
const progressService = require("../services/progressService");
const Progress = require("../models/Progress");
const router = express.Router();

// Rota para criar progresso
router.post("/", async (req, res) => {
  const { userId, score, level, completedPuzzles } = req.body;
  try {
    const newProgress = await progressService.createProgress(
      userId,
      score,
      level,
      completedPuzzles
    );
    res.status(201).json(newProgress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rota para obter progresso de um aluno específico
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // LOG para depuração
    console.log("Recebido userId:", userId);

    // Verifica se o userId é um ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID de usuário inválido." });
    }

    const progress = await progressService.getProgressByUserId(userId);

    if (!progress) {
      return res.status(404).json({ message: "Progresso não encontrado" });
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error("Erro na rota /progress/:userId:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// Rota para listar todos os progressos
router.get("/", async (req, res) => {
  try {
    const progressList = await progressService.getAllProgress();
    res.status(200).json(progressList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para atualizar progresso
router.put("/:userId", async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  try {
    const updatedProgress = await progressService.updateProgress(
      userId,
      updates
    );
    res.status(200).json(updatedProgress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rota para excluir progresso
router.delete("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedProgress = await progressService.deleteProgress(userId);
    res.status(200).json(deletedProgress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/update", async (req, res) => {
  const { userId, completedPuzzle } = req.body;

  if (!userId || !completedPuzzle) {
    return res.status(400).json({ message: "Dados insuficientes" });
  }

  try {
    let progress = await Progress.findOne({ userId });

    if (!progress) {
      progress = new Progress({
        userId,
        completedPuzzles: [completedPuzzle],
        currentLevel: completedPuzzle,
      });
    } else {
      if (!progress.completedPuzzles.includes(completedPuzzle)) {
        progress.completedPuzzles.push(completedPuzzle);
      }

      progress.currentLevel = completedPuzzle;
    }

    await progress.save();
    return res
      .status(200)
      .json({ message: "Progresso atualizado com sucesso", progress });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao salvar progresso", error: error.message });
  }
});

// Rota para salvar progresso parcial (nível em andamento)
router.post("/save-partial", async (req, res) => {
  const { userId, currentLevel, currentState } = req.body;

  if (!userId || !currentLevel || !currentState) {
    return res.status(400).json({ message: "Dados insuficientes" });
  }

  try {
    let progress = await Progress.findOne({ userId });

    if (!progress) {
      progress = new Progress({
        userId,
        completedPuzzles: [],
        currentLevel,
        currentState,
      });
    } else {
      progress.currentLevel = currentLevel;
      progress.currentState = currentState;
    }

    await progress.save();

    res
      .status(200)
      .json({ message: "Progresso parcial salvo com sucesso", progress });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao salvar progresso parcial",
      error: error.message,
    });
  }
});

module.exports = router;
