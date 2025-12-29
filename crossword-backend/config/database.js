const mongoose = require("mongoose");
require("dotenv").config(); // Carrega as variáveis de ambiente do .env

// URL do MongoDB (local ou na nuvem)
const mongoURI = process.env.MONGO_URI;

// Função para conectar ao MongoDB
console.log("DEBUG MONGO_URI:", process.env.MONGO_URI);
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Conectado ao MongoDB com sucesso!");
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error.message);
    process.exit(1); // Encerra o processo em caso de erro
  }
};

module.exports = connectDB;
