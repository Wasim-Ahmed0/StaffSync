import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

//API endpoit used to create announcements from HR employees
//Takes body from the form and then creates it as an announcement in the prisma database
export default async function announcementCreate(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  try {
    const { title, text, role } = req.body;

    const savedAnnouncement = await prisma.announcement.create({
      data: {
        title: title,
        text: text,
        role: role,
      },
    });
    res.status(200).json(savedAnnouncement);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Something went wrong" });
  }
}
