import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { message, username, ticketId } = req.body;

  try {
    const newMessage = await prisma.message.create({
      data: {
        text: message,
        ticketId: parseInt(ticketId),
        userUsername: username,
      },
      include: {
        User: true,
      },
    });
    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error creating comment:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
