import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PATCH") {
    try {
      const payment = await prisma.payment.update({
        where: { id },
        data: {
          status: "SUCCESS",
          paidAt: new Date(),
        },
        include: {
          order: true,
        },
      });

      // update order status juga
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          status: "PROCESSING",
        },
      });

      return res.status(200).json({
        message: "Payment success",
        payment,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
