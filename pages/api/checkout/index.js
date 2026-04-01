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

  if (req.method === "POST") {
    const { note, paymentMethod } = req.body;

    try {
      const cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty" });
      }

      // hitung total
      const totalPrice = cart.items.reduce(
        (acc, item) => acc + item.product.price * item.quantity,
        0,
      );

      // buat order
      const order = await prisma.order.create({
        data: {
          userId: session.user.id,
          totalPrice,
          note,
        },
      });

      // buat order items
      for (const item of cart.items) {
        // 🔥 CEK STOCK DULU
        if (item.product.stock < item.quantity) {
          return res.status(400).json({
            message: `Stock produk ${item.product.name} tidak cukup`,
          });
        }

        // 🔥 KURANGI STOCK
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });

        // 🔥 CREATE ORDER ITEM
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            note: item.note,
          },
        });
      }

      // buat payment
      const payment = await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: totalPrice,
          method: paymentMethod || "COD",
        },
      });

      // kosongkan cart
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return res.status(201).json({
        message: "Checkout success",
        order,
        payment,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
