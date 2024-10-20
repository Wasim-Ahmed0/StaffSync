import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Method Not Allowed", allowedMethods: ["POST"] });
  }

  try {
    const { ticketId, newStatus } = req.body;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: { status: newStatus },
    });

    res.json(updatedTicket);
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({ error: "Failed to update ticket status" });
  }
}
