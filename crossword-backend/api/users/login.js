export default async function handler(req, res) {
  if (req.method === "POST") {
    // Simula resposta de sucesso
    res.status(200).json({
      token: "faketoken123456789",
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
