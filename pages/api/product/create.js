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

  if (req.method === "POST") {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: "Upload error" });
      }

      const { name, price, stock } = fields;

      let imageUrl = null;

      const fileData = Array.isArray(files.image)
        ? files.image[0]
        : files.image;

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
      }

      const product = await prisma.product.create({
        data: {
          name: String(name),
          price: Number(price),
          stock: Number(stock) || 0,
          imageUrl,
        },
      });

      return res.status(201).json(product);
    });
    return;
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
