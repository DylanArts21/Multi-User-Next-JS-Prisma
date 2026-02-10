import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../app/api/auth/[...nextauth]/route";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method === "POST") {
    try {
      const { name, price, stock } = req.body;

      if (!name || price == null) {
        return res.status(400).json({ message: "Name and price are required" });
      }

      const product = await prisma.product.create({
        data: {
          name,
          price: Number(price),
          stock: Number(stock) || 0,
        },
      });

      return res.status(201).json(product);
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
