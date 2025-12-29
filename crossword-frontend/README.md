# Crossword Game 🎮

Este jogo de palavras cruzadas é uma demonstração do meu projeto principal, que consiste em uma plataforma de ensino com diversos jogos.

🧩 **Nesta versão:**

- Níveis armazenados no frontend (arquivo JSON).
- Funcionalidades implementadas localmente, sem a necessidade de um backend.
- Palavras cruzadas com diferentes temas e níveis de dificuldade.
- Navegação fluida via teclado.

## Tecnologias Usadas

- React
- Vite
- CSS

🔗 **No projeto principal:**

- Backend completo com arquitetura MVC.
- API REST com Node.js + Express.
- Autenticação com JWT.
- Banco de dados MongoDB.

## 🎯 Objetivo deste Projeto

Repositório criado como uma demonstração de um jogo de palavras cruzadas. Criado para ajudar pessoas a estudar inglês. Se você estiver interessado em conhecer o projecto completo, me contate.

---

## ⚙️ Como executar este projeto localmente

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/crossword-game.git
   cd crossword-game
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Execute o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Abra no navegador:
   - Local: [http://localhost:3000](http://localhost:3000)
   - Rede: Use `--host` ao rodar o servidor para acesso externo.

---

## 📂 Estrutura do Projeto

```
src/
├── components/         # Componentes React
│   └── Crossword.jsx   # Componente principal para o jogo
├── data/               # Dados estáticos dos níveis
│   └── levels.json     # Dados dos níveis no frontend
├── App.jsx             # Renderização inicial da aplicação
└── index.css           # Estilização global
```

---

## 📜 Licença

Este projeto está licenciado sob a [MIT License](https://opensource.org/licenses/MIT).
