const mongoose = require("mongoose");

// Schema para o Progresso do Usuário
const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completedPuzzles: [
      {
        type: String,
        required: true,
      },
    ],

    currentLevel: {
      type: String,
      default: "Level 1 - at the hotel",
    },
    currentState: {
      type: Object,
    },
  },
  { timestamps: true }
);

// Exporta o modelo
const Progress = mongoose.model("Progress", progressSchema);
module.exports = Progress;
