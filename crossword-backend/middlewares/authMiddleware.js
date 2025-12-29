const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];
  const secretKey = process.env.SECRET_KEY || "fallback_secret";

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded; // armazena dados do usuário no request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = { authMiddleware };
