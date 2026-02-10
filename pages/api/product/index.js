import prisma from "../../../lib/prisma";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session || session.user.role !== "ADMIN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // GET list product
  if (req.method === "GET") {
    const products = await prisma.product.findMany({
      orderBy: { id: "desc" },
    });
    return res.json(products);
  }

  // CREATE product
  if (req.method === "POST") {
    const { name, price } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price,
      },
    });

    return res.status(201).json(product);
  }

  res.status(405).end();
}
