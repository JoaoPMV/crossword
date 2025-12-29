export default async function handler(req, res) {
  if (req.method === "POST") {
    let body = {};
    try {
      body = req.body || {};
      // Se vier vazio, tenta o parse manual (correção Vercel)
      if (typeof body === "string" && body.trim().length) {
        body = JSON.parse(body);
      }
    } catch (error) {
      body = {};
    }

    res.status(200).json({
      token: "123",
      user: {
        id: 1,
        email: body.email || "teste@email.com",
        nome: "Joao",
      },
    });
  } else {
    res.status(405).json({ error: "Método não permitido" });
  }
}
