import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../app/api/auth/[...nextauth]/route";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.query;

  // GET detail
  if (req.method === "GET") {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        return res.status(404).json({ message: "Product tidak ditemukan" });
      }

      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }

  // UPDATE
  if (req.method === "PUT") {
    const { name, price } = req.body;

    try {
      const product = await prisma.product.update({
        where: { id },
        data: {
          name,
          price: Number(price),
        },
      });

      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ message: "Gagal update product" });
    }
  }

  // DELETE
  if (req.method === "DELETE") {
    try {
      await prisma.product.delete({
        where: { id },
      });

      return res.status(200).json({ message: "Product berhasil dihapus" });
    } catch (error) {
      return res.status(500).json({ message: "Gagal menghapus product" });
    }
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
