import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../app/api/auth/[...nextauth]/route";
import prisma from "../../../lib/prisma";

const allowedStatuses = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
];

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { id } = req.query;

  if (req.method === "PATCH") {
    try {
      const { status } = req.body;

      if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({
          message:
            "Status tidak valid. Gunakan PENDING, PROCESSING, SHIPPED, COMPLETED, atau CANCELLED.",
        });
      }

      const updated = await prisma.order.update({
        where: { id },
        data: { status },
      });

      return res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Gagal update status" });
    }
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
