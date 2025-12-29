const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  startCell: { type: Number, required: true }, // Posição inicial na grade
  dir: { type: String, enum: ["down", "across"], required: true }, // Direção: "down" ou "across"
  answer: { type: String, required: true }, // Resposta correspondente
  clue: { type: String, default: "" }, // Dica para a palavra (opcional)
});

const gameSchema = new mongoose.Schema(
  {
    level: { type: String, required: true }, // Nome do nível
    slug: { type: String, required: true, unique: true }, // Identificador único do nível
    id: { type: String, required: true, unique: true }, // ID único do jogo
    words: { type: [wordSchema], required: true }, // Array das palavras associadas ao jogo
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
