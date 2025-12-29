export default async function handler(req, res) {
  if (req.method === "POST") {
    // Sua lógica de login aqui
    res.status(200).json({ mensagem: "Login OK!" });
  } else {
    res.status(405).json({ erro: "Método não permitido" });
  }
}
