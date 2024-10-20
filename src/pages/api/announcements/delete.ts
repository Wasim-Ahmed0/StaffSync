import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

//API endpoint for announcement deletion utilising the announcement ID as the identifier for deletion
//Utilised POST as Nextauth.js did not allow for DELETE method to work
//Ensures that it also deals with errors as accordingly
export default async function announcementDelete(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    try {
      const { announcementID } = req.body;

      if (!announcementID) {
        return res
          .status(400)
          .json({ err: "Announcement ID not present in Announcements" });
      }

      const deletedAnnouncement = await prisma.announcement.delete({
        where: {
          id: Number(announcementID),
        },
      });
      res.status(200).json(deletedAnnouncement);
    } catch (err) {
      console.error(err);
      res.status(500).json({ err: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ err: "Method not permitted" });
  }
}
