const Game = require("../models/Games"); // Importa o modelo de jogo

class GameService {
  // Cria um novo jogo no banco de dados
  async createGame(gameData) {
    try {
      const newGame = new Game(gameData);
      return await newGame.save(); // Salva os dados do jogo no banco
    } catch (error) {
      throw new Error("Erro ao criar jogo: " + error.message);
    }
  }

  // Recupera todos os jogos armazenados, ordenados pelo campo "id"
  async getAllGames() {
    try {
      const games = await Game.find().sort({ id: 1 }); // Ordena pelo campo "id" em ordem crescente
      return games;
    } catch (error) {
      console.error("GameService: Erro ao buscar jogos ->", error.message);
      throw new Error("Erro ao buscar jogos: " + error.message);
    }
  }

  // Recupera um jogo específico por slug
  async getGameBySlug(slug) {
    try {
      const game = await Game.findOne({ slug });
      if (!game) {
        throw new Error("Jogo não encontrado!");
      }
      return game;
    } catch (error) {
      throw new Error("Erro ao buscar jogo: " + error.message);
    }
  }

  // Atualiza um jogo existente
  async updateGame(slug, updatedData) {
    try {
      const game = await Game.findOneAndUpdate({ slug }, updatedData, {
        new: true, // Retorna o registro atualizado
      });
      if (!game) {
        throw new Error("Jogo não encontrado para atualizar!");
      }
      return game;
    } catch (error) {
      throw new Error("Erro ao atualizar jogo: " + error.message);
    }
  }

  // Exclui um jogo
  async deleteGame(slug) {
    try {
      const game = await Game.findOneAndDelete({ slug });
      if (!game) {
        throw new Error("Jogo não encontrado para exclusão!");
      }
      return { message: "Jogo excluído com sucesso" };
    } catch (error) {
      throw new Error("Erro ao excluir jogo: " + error.message);
    }
  }
}

module.exports = new GameService();
