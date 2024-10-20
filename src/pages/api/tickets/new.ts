import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { subject, description } = req.body;

  const session = await getServerSession(req, res, authOptions);
  if (session) {
    const result = await prisma.ticket.create({
      data: {
        subject: subject,
        User: { connect: { username: session.user.username } },
        messages: {
          create: [{ userUsername: session.user.username, text: description }],
        },
      },
    });
    res.json(result);
  } else {
    res.status(401).send({ message: "Unauthorized" });
  }
}
