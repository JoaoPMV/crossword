export default async function handler(req, res) {
  if (req.method === "POST") {
    res.status(200).json({
      token: "123",
      user: {
        id: 1,
        email: "teste@email.com",
        nome: "Joao",
      },
    });
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
