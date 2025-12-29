// Require dotenv to load environment variables
require("dotenv").config({ path: "../.env" });
const connectDB = require("../config/database"); // Garante que o mesmo módulo de conexão seja usado
const Game = require("../models/Games"); // Certifique-se de que o caminho está correto

// Função para adicionar ou atualizar níveis ao banco de dados
const addNewGame = async () => {
  // Conecta ao banco de dados antes de qualquer operação
  await connectDB();

  // Dados do segundo nível a ser adicionado
  const newGameData = {
    level: "Level 0 - at the airport",
    id: "4",
    slug: "airport2",
    words: [{ startCell: 1, dir: "down", answer: "IMMIGRATION", clue: "" }],
  };

  try {
    // Verifica se o nível (Level 2) já existe no banco de dados
    const existingGame = await Game.findOne({ id: newGameData.id });
    if (existingGame) {
      console.log(
        `O nível "${newGameData.level}" já está salvo no banco de dados.`
      );
    } else {
      // Adiciona o novo nível ao banco
      await Game.create(newGameData);
      console.log(
        `O nível "${newGameData.level}" foi adicionado ao banco de dados com sucesso!`
      );
    }
    process.exit(0); // Finaliza a execução
  } catch (error) {
    console.error("Erro ao verificar ou adicionar o nível:", error.message);
    process.exit(1); // Indica erro na execução
  }
};

// Executa a função de adição
addNewGame();
