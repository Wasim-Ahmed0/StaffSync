import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import argon2 from "argon2";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

// Function to generate a random 5-digit number between 10000 - 90000
function generateUsername() {
  const randomNumber = Math.floor(Math.random() * 90000) + 10000;
  return `${randomNumber}`;
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || session.user.role !== "TECHNICIAN") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Extract user data from req body
  const { firstName, lastName, password, email, phoneNumber, role } = req.body;

  try {
    // Generate Username
    const username = generateUsername();

    // Hash the raw password from req body
    const hashedPassword = await argon2.hash(password);

    // Create  user in database
    const newUser = await prisma.user.create({
      data: {
        username,
        firstName,
        lastName,
        password: hashedPassword,
        email,
        phoneNumber,
        leaveBalance: 28,
        role,
      },
    });
    return res.status(200).json(newUser);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return res
        .status(409)
        .json({ message: "This email / phone number is already in use." });
    } else {
      // Handle potential errors, like duplicate email or phone number since @unique in schema
      console.error("Failed to create user:", error);
      return res.status(500).json({ message: "Failed to create user" });
    }
  }
}
