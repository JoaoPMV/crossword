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
    level: "Level 4 - at the supermarket",
    id: "4",
    slug: "supermarket",
    words: [
      { startCell: 1, dir: "across", answer: "DETERGENT", clue: "" },
      { startCell: 23, dir: "across", answer: "FLOUR", clue: "" },
      { startCell: 39, dir: "across", answer: "SALT", clue: "" },
      { startCell: 69, dir: "across", answer: "SOUP", clue: "" },
      { startCell: 89, dir: "across", answer: "EGGS", clue: "" },
      { startCell: 105, dir: "across", answer: "CHEESE", clue: "" },
      { startCell: 9, dir: "down", answer: "TOOTHPASTE", clue: "" },
      { startCell: 11, dir: "down", answer: "RICE", clue: "" },
      { startCell: 25, dir: "down", answer: "OIL", clue: "" },
      { startCell: 39, dir: "down", answer: "SOAP", clue: "" },
      { startCell: 45, dir: "down", answer: "BUTTER", clue: "" },
      { startCell: 66, dir: "down", answer: "JUICE", clue: "" },
      { startCell: 69, dir: "down", answer: "SUGAR", clue: "" },
    ],
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
