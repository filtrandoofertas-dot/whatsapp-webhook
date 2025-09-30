const express = require("express");
const fetch = require("node-fetch"); // precisa estar no package.json
const app = express();

app.use(express.json());

// Token que você cadastrou no painel do Meta (o mesmo que digita lá)
const VERIFY_TOKEN = "rock";

// Webhook do Make (substitua pela URL do seu webhook no Make)
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/nomwh72all6gpn9uj16uvcqawzyu667j";

// 🔹 GET → usado só na validação inicial do Meta
app.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verificado!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// 🔹 POST → toda mensagem recebida do WhatsApp cai aqui
app.post("/", async (req, res) => {
  console.log("📩 Recebi do Meta:", JSON.stringify(req.body, null, 2));

  // responde imediatamente para o Meta
  res.sendStatus(200);

  try {
    // repassa para o Make
    await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    console.log("➡️ Repassado para o Make com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao repassar para o Make:", err);
  }
});

// Porta do Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
