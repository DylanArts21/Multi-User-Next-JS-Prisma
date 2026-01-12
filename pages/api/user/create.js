import prisma from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password, role } = req.body;

  // Hash password agar aman di database
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "user",
      },
    });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    res
      .status(400)
      .json({ message: "User already exists or error occurred", error });
  }
}
