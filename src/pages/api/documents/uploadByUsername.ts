import { NextApiRequest, NextApiResponse } from "next";
import busboy from "busboy";
import prisma from "@/lib/prisma";

export const config = { api: { bodyParser: false } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    var username: string;
    var docData: Buffer[] = [];
    var filename: string;

    const bb = busboy({ headers: req.headers });
    bb.on("field", (name, val, info) => {
      if (name == "username") {
        username = val;
      }
    });
    bb.on("file", (name, file, info) => {
      file.on("data", (data: Buffer) => {
        docData.push(data);
        filename = info.filename;
      });
    });
    bb.on("close", async () => {
      const doc = await prisma.document.create({
        data: {
          filename: filename,
          data: Buffer.concat(docData),
          userUsername: username,
        },
        select: {
          id: true,
          filename: true,
          userUsername: true,
          dateCreated: true,
        },
      });
      res.status(200).json(doc);
    });
    req.pipe(bb);
  } catch (error) {
    console.error("Unexpected error occurred:", error);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
}
