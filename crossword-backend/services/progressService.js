const mongoose = require("mongoose");
const Progress = require("../models/Progress");

class ProgressService {
  // Cria o progresso de um usuário
  async createProgress(userId, completedPuzzles = []) {
    try {
      const progress = new Progress({ userId, completedPuzzles });
      return await progress.save();
    } catch (error) {
      throw new Error("Erro ao criar progresso: " + error.message);
    }
  }

  // Obtém o progresso de um usuário específico pelo `userId`
  async getProgressByUserId(userId) {
    try {
      // Verifica se o userId é um ObjectId válido
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("userId fornecido não é um ObjectId válido.");
      }

      const progress = await Progress.findOne({ userId }).populate(
        "userId",
        "name email" // Traz informações do usuário (se necessário)
      );
      if (!progress) {
        throw new Error("Progresso não encontrado para este usuário.");
      }
      return progress;
    } catch (error) {
      throw new Error("Erro ao buscar progresso do usuário: " + error.message);
    }
  }

  // Atualiza o progresso de um usuário para adicionar um nível concluído
  async addCompletedPuzzle(userId, completedPuzzle) {
    try {
      const progress = await Progress.findOne({ userId });

      if (!progress) {
        // Se o progresso ainda não existir, cria um novo registro
        const newProgress = new Progress({
          userId,
          completedPuzzles: [completedPuzzle],
        });
        return await newProgress.save();
      }

      // Se o progresso já existir, adiciona o nível à lista (se ainda não estiver incluído)
      if (!progress.completedPuzzles.includes(completedPuzzle)) {
        progress.completedPuzzles.push(completedPuzzle);
        return await progress.save();
      }

      return progress; // Retorna sem alterações se o nível já estiver registrado
    } catch (error) {
      throw new Error(
        "Erro ao adicionar nível concluído no progresso: " + error.message
      );
    }
  }

  // Lista o progresso de todos os usuários
  async getAllProgress() {
    try {
      return await Progress.find().populate("userId", "name email");
    } catch (error) {
      throw new Error("Erro ao obter todos os progressos: " + error.message);
    }
  }

  // Exclui o progresso de um aluno pelo `userId`
  async deleteProgress(userId) {
    try {
      const deletedProgress = await Progress.findOneAndDelete({ userId });
      if (!deletedProgress) {
        throw new Error("Progresso não encontrado para excluir.");
      }
      return deletedProgress;
    } catch (error) {
      throw new Error("Erro ao excluir progresso: " + error.message);
    }
  }
}

module.exports = new ProgressService();
