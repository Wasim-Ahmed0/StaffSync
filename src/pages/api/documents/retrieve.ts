import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const document = await prisma.document.findUnique({
      where: {
        id: Number(req.query["id"]),
      },
    });

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + document?.filename,
    );
    res.setHeader("Content-Type", "application/octet-stream");

    res.send(document?.data);
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({ error: "Failed to fetch documents" });
  }
}
