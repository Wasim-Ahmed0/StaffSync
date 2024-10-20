import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import argon2 from "argon2";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Extract user data from req body
  let { username, firstName, lastName, password, email, phoneNumber } =
    req.body;

  // don't update empty fields
  if (firstName == "") {
    firstName = undefined;
  }
  if (lastName == "") {
    lastName = undefined;
  }
  if (email == "") {
    email = undefined;
  }
  if (phoneNumber == "") {
    phoneNumber = undefined;
  }

  try {
    // Hash the raw password from req body
    const hashedPassword = password ? await argon2.hash(password) : undefined;

    // Update  user in database
    const updatedUser = await prisma.user.update({
      where: { username },
      data: {
        firstName,
        lastName,
        password: hashedPassword,
        email,
        phoneNumber,
      },
    });
    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return res
        .status(409)
        .json({ message: "This email / phone number is already in use." });
    } else {
      // Handle potential errors, like duplicate email or phone number since @unique in schema
      console.error("Failed to update user:", error);
      return res.status(500).json({ message: "Failed to update user" });
    }
  }
}
