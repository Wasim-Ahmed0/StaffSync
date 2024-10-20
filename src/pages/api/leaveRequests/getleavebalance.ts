// pages/api/users/[username]/leaveBalance.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    const { username } = req.query;

    try {
      const balance = await prisma.user.findUnique({
        where: { username: String(username) },
        select: { leaveBalance: true },
      });

      if (balance) {
        res.status(200).json(balance);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
