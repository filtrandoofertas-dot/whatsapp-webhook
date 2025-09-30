const express = require("express");
const fetch = require("node-fetch"); // precisa dessa lib
const app = express();

app.use(express.json());

// Token que você escolheu no painel do Meta
const VERIFY_TOKEN = "rock";

// Webhook do Make (cole o seu aqui)
const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/SEU_WEBHOOK_ID";

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

// 🔹 POST → toda mensagem recebida no WhatsApp vem aqui
app.post("/", async (req, res) => {
  console.log("📩 Recebi do Meta:", JSON.stringify(req.body, null, 2));

  // responde imediatamente para o Meta (tem que ser rápido)
  res.sendStatus(200);

  try {
    // repassa o mesmo body para o Make
    await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });
    console.log("➡️ Repassado para o Make com sucesso!");
  } catch (err) {
    console.error("Erro ao repassar para o Make:", err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
