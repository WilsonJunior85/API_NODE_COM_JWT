import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Cadastro
router.post("/cadastro", async (req, res) => {
  try {
    const user = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);

    const userDB = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashPassword,
      },
    });
    res.send(201).json(userDB); // Status 201 significa criado com sucesso
  } catch (err) {
    res.status(500).json({ message: "Erro no Servidor, tente novamente" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const userInfo = req.body;

    const user = await prisma.user.findUnique({
      where: { email: userInfo.email },
    });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    // Compara o que o usuário digitou
    const isMatch = await bcrypt.compare(userInfo.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Senha Inválida" });
    }

    //Gerar p Token JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1m" });

    res.status(200).json(token);
  } catch (err) {
    res.status(500).json({ message: "Erro no Servidor, tente novamente" });
  }
});

export default router;

// mongodb+srv://JuniorMongoDB:<db_password>@users.3ygi8p0.mongodb.net/?appName=Users
