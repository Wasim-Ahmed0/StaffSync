import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { reason, startDate, endDate, userUsername } = req.body;
    const leaveRequest = await prisma.leaveRequest.create({
      data: { reason, startDate, endDate, userUsername },
    });
    res.status(200).json(leaveRequest);
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
