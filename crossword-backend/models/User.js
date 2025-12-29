const mongoose = require("mongoose");

// Schema para o Usuário
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Campo obrigatório
    },
    email: {
      type: String,
      required: true,
      unique: true, // Email deve ser único
    },
    password: {
      type: String,
      required: true, // O password também é obrigatório
    },
  },
  { timestamps: true }
); // Adiciona campos "createdAt" e "updatedAt" automaticamente

// Exporta o model
const User = mongoose.model("User", userSchema);
module.exports = User;
