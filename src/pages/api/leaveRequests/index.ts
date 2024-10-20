import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "GET") {
    try {
      const { userUsername } = req.query;
      let whereClause;
      if (userUsername) {
        if (Array.isArray(userUsername)) {
          // Handle array case (select the first element, for example)
          whereClause = { userUsername: userUsername[0] };
        } else {
          // Handle single string case
          whereClause = { userUsername };
        }
      }

      if (whereClause) {
        // Fetch leave requests for a specific user
        const leaveRequests = await prisma.leaveRequest.findMany({
          where: whereClause,
        });
        res.status(200).json(leaveRequests);
      } else {
        // Fetch all leave requests
        const leaveRequests = await prisma.leaveRequest.findMany();
        res.status(200).json(leaveRequests);
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error);
      res.status(500).json({ error: "Failed to fetch leave requests" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
