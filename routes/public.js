import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

// Cadastro
router.post("/cadastro", async (req, res) => {
  const user = req.body;
  await prisma.user.create({
    data: {
      email: user.email,
      name: user.name,
      password,
    },
  });
  res.send(201).json(user); // Status 201 significa criado com sucesso
});
export default router;

// mongodb+srv://JuniorMongoDB:<db_password>@users.3ygi8p0.mongodb.net/?appName=Users
