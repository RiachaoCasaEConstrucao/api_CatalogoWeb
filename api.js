const express = require("express");
const db = require("./database");
const cors = require("cors");

const app = express();

const allowedOrigins = [
  "https://catalogoriachao-production.up.railway.app",
  "http://localhost:3001",
  "http://localhost:3000",
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
app.post("/carrinho", async (req, res) => {
  try {
    const { produto_id } = req.body;
    const usuario_id = 1;
    await db.query(
      "INSERT INTO carrinho ( usuario_id, produto_id) VALUES (?, ?)",
      [usuario_id, produto_id]
    );
    res.status(201).json({ message: "Produto adicionado à lista com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar produto à lista:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.get("/usuarios", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM usuarios");
    res.json(results);
  } catch (error) {
    console.error("Erro ao buscar carrinho:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.post("/usuarios", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const tipo_usuario = "cliente";
    await db.query(
      "INSERT INTO usuarios (nome, email, senha, tipo_usuario) VALUES (?,?,?,?)",
      [nome, email, senha, tipo_usuario]
    );
    res.status(201).json({ message: "Usuário cadastrado com sucesso" });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
