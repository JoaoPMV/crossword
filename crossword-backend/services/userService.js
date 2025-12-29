const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

class UserService {
  async createUser(name, email, password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // 10 é o número de rounds do algoritmo de hashing
      const user = new User({ name, email, password: hashedPassword });
      const savedUser = await user.save();
      return savedUser;
    } catch (error) {
      // Tratar erro de índice duplicado
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        throw new Error("E-mail já está cadastrado.");
      }
      throw new Error("Erro ao criar usuário repetido: " + error.message);
    }
  }

  // Recupera todos os usuários
  async getAllUsers() {
    try {
      return await User.find();
    } catch (error) {
      throw new Error("Erro ao recuperar usuários: " + error.message);
    }
  }

  // Autentica um usuário (Login)
  async authenticateUser(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Usuário ou senha inválidos");
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Usuário ou senha inválidos");
      }

      const secretKey = process.env.SECRET_KEY || "fallback_secret";

      const token = jwt.sign({ id: user._id, email: user.email }, secretKey, {
        expiresIn: "1h",
      });

      return { user, token };
    } catch (error) {
      throw new Error("Erro ao autenticar usuário: " + error.message);
    }
  }
}

module.exports = new UserService();
