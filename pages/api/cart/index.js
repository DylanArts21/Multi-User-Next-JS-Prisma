import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../app/api/auth/[...nextauth]/route";
import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if ((session.user.role || "").toLowerCase() !== "user") {
    return res.status(403).json({ message: "Forbidden" });
  }

  if (req.method === "GET") {
    try {
      const cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
      return res.status(200).json(cart);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  if (req.method === "POST") {
    const { productId, quantity } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }
    const qty = Number(quantity) || 1;
    try {
      let cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
      });
      if (!cart) {
        cart = await prisma.cart.create({ data: { userId: session.user.id } });
      }
      const existing = await prisma.cartItem.findUnique({
        where: {
          cartId_productId: { cartId: cart.id, productId },
        },
      });
      let cartItem;
      if (existing) {
        cartItem = await prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: existing.quantity + qty },
        });
      } else {
        cartItem = await prisma.cartItem.create({
          data: { cartId: cart.id, productId, quantity: qty },
        });
      }
      return res.status(201).json(cartItem);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
