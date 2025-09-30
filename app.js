const express = require("express");
const app = express();

const port = process.env.PORT || 3000;

// Rota para validação do webhook do Meta
app.get("/", (req, res) => {
  const verifyToken = "rock"; // o mesmo que você colocar no painel do Meta

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token && mode === "subscribe" && token === verifyToken) {
    console.log("WEBHOOK VERIFICADO ✅");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
