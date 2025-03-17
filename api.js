const express = require("express");
const db = require("./database");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:3000",
  "https://catalogoweb-production.up.railway.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permite requisições do domínio listado ou de localhost
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true); // Aceita a requisição
      } else {
        callback(new Error("Não permitido por CORS")); // Rejeita requisições de outros domínios
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware para converter JSON
app.use(express.json());

// Rota inicial
app.get("/", (req, res) => {
  res.json({
    message: "API RESTful de produtos",
  });
});

// Rota para obter todos os produtos
app.get("/produtos", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM produtos");
    res.json(results);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/categorias", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM categorias");
    res.json(results);
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get('/carrinho', async (req, res) => {
    try {
        const usuario_id = 1;
        const [results] = await db.query(`
            SELECT c.usuario_id, p.nome, p.preco
            FROM carrinho c
            JOIN produtos p ON c.produto_id = p.id
            WHERE c.usuario_id = ?
        `, [usuario_id]);

        res.json(results);
    } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Iniciar o servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
