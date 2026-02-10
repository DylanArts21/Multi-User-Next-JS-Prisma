import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../app/api/auth/[...nextauth]/route";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  const product = await prisma.product.create({
    data: {
      name,
      price: Number(price),
    },
  });

  return res.status(201).json(product);
}
