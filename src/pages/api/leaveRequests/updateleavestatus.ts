import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query;

  if (req.method === "PATCH") {
    try {
      const { requestStatus } = req.body;

      const updatedLeaveRequest = await prisma.leaveRequest.update({
        where: { id: Number(id) },
        data: { requestStatus, dateResponded: new Date() },
      });

      res.status(200).json(updatedLeaveRequest);
    } catch (error) {
      console.error("Error updating leave request status:", error);
      res.status(500).json({ error: "Failed to update leave request status" });
    }
  } else {
    res.setHeader("Allow", ["PATCH"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
