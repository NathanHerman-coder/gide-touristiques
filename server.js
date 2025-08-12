require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const AVIS_FILE = "./avis.json";

function lireAvis() {
  if (!fs.existsSync(AVIS_FILE)) return [];
  const data = fs.readFileSync(AVIS_FILE, "utf-8");
  return JSON.parse(data);
}

function ecrireAvis(avisList) {
  fs.writeFileSync(AVIS_FILE, JSON.stringify(avisList, null, 2));
}

app.get("/api/avis", (req, res) => {
  const avisList = lireAvis();
  res.json(avisList);
});

app.post("/api/avis", (req, res) => {
  const { nom, message, note } = req.body;
  if (!nom || !message || !note) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  const avisList = lireAvis();
  avisList.push({ nom, message, note });
  ecrireAvis(avisList);

  res.json({ message: "Avis ajouté avec succès." });
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/api/contact", (req, res) => {
  const { nom, email, sujet, message } = req.body;
  if (!nom || !email || !sujet || !message) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `Contact depuis site : ${sujet}`,
    text: `Nom: ${nom}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erreur envoi mail:", error);
      return res.status(500).json({ error: "Erreur serveur lors de l'envoi du mail." });
    }
    res.json({ message: "Message envoyé avec succès." });
  });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
