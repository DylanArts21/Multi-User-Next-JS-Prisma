import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../app/api/auth/[...nextauth]/route";
import prisma from "../../../lib/prisma";
import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: "Upload error" });
      }

      try {
        const name = fields.name;
        const price = fields.price;
        const stock = fields.stock;

        const fileData = Array.isArray(files.image)
          ? files.image[0]
          : files.image;

        // Ambil product lama
        const existingProduct = await prisma.product.findUnique({
          where: { id },
        });

        if (!existingProduct) {
          return res.status(404).json({ message: "Product tidak ditemukan" });
        }

        let imageUrl = existingProduct.imageUrl;

        // Kalau upload gambar baru
        if (fileData?.filepath) {
          const data = fs.readFileSync(fileData.filepath);
          const fileName = Date.now() + "_" + fileData.originalFilename;

          const uploadDir = path.join(process.cwd(), "public/uploads");

          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }

          const uploadPath = path.join(uploadDir, fileName);
          fs.writeFileSync(uploadPath, data);

          imageUrl = "/uploads/" + fileName;

          // Hapus gambar lama kalau ada
          if (existingProduct.imageUrl) {
            const oldPath = path.join(
              process.cwd(),
              "public",
              existingProduct.imageUrl,
            );

            if (fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath);
            }
          }
        }

        const updatedProduct = await prisma.product.update({
          where: { id },
          data: {
            name: String(name),
            price: Number(price),
            stock: Number(stock) || 0,
            imageUrl,
          },
        });

        return res.status(200).json(updatedProduct);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Gagal update product" });
      }
    });

    return;
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
