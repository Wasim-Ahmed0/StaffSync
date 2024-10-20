import Head from "next/head";
import axios from "axios";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]";
import { Ticket, Prisma } from "@prisma/client";
import BackButton from "@/components/BackButton";
import { Icon } from "@iconify/react/dist/iconify.js";
import GreenButton from "@/components/GreenButton";
import prisma from "@/lib/prisma";
import { motion } from "framer-motion";
import TicketStatus from "@/components/TicketStatus";
import Modal from "@/components/Modal";

const messageWithUser = Prisma.validator<Prisma.MessageDefaultArgs>()({
  include: { User: true },
});

type MessageWithUser = Prisma.MessageGetPayload<typeof messageWithUser>;

type Props = {
  ticket: Ticket;
  messages: MessageWithUser[];
};

export default function UserTicket({ ticket: initialTicket, messages }: Props) {
  const session = useSession();
  const [ticket, setTicket] = useState(initialTicket);
  const [message, setMessage] = useState("");
  const [commentList, setCommentList] = useState(messages);
  const [visible, setVisible] = useState(false);
  const [isTicketSolved, setIsTicketSolved] = useState(
    ticket.status === "Resolved",
  );
  const isAdmin =
    session?.data?.user?.role === "HR" ||
    session?.data?.user?.role === "TECHNICIAN";

  useEffect(() => {
    setIsTicketSolved(ticket.status === "Resolved");
  }, [ticket.status]);

  const handleSubmit = async () => {
    if (message == "") {
      setVisible(true);
      return;
    }

    try {
      const response = await axios.post("/api/tickets/newMessage", {
        message,
        username: session?.data?.user?.username,
        ticketId: ticket.id,
      });

      const newComment = response.data;
      setCommentList([...commentList, newComment]);
      setMessage("");
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const handleClick = async () => {
    try {
      const newStatus = isTicketSolved ? "Unresolved" : "Resolved";
      const updatedTicket = await axios.post("/api/tickets/updateStatus", {
        ticketId: ticket.id,
        newStatus,
      });
      setTicket(updatedTicket.data);
      setIsTicketSolved(newStatus === "Unresolved");
    } catch (error) {
      console.error("Error changing ticket status ", error);
    }
  };

  const list = {
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };

  const item = {
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "tween" },
    },
    hidden: { opacity: 0, y: 10, filter: "blur(3px)" },
  };

  return (
    <>
      <Head>
        <title>StaffSync - Ticket - {ticket.subject}</title>
      </Head>
      <div className="flex flex-col gap-3">
        <BackButton />
        <div className="flex flex-row items-start justify-between gap-3 max-md:flex-col">
          <div>
            <h1 className="text-sm font-semibold">Ticket</h1>
            <h2 className="text-4xl font-semibold">
              <span className="font-medium text-neutral-400">
                #{ticket.id}{" "}
              </span>
              {ticket.subject}
            </h2>
          </div>
          <div className="flex h-min flex-row gap-2 max-md:w-full max-md:flex-col">
            <TicketStatus status={ticket.status} />
            {ticket.status == "Unresolved" && isAdmin && (
              <GreenButton onClick={handleClick}>Mark as resolved</GreenButton>
            )}
          </div>
        </div>
        <motion.div
          className="flex flex-col gap-2"
          initial="hidden"
          animate="visible"
          variants={list}
        >
          {commentList.map((comment, index) => (
            <motion.div
              key={index}
              variants={item}
              className={`rounded-2xl bg-opacity-80 p-3 text-black ${
                comment.userUsername == session.data?.user?.username
                  ? "bg-lime-100"
                  : "bg-white"
              }`}
            >
              <div className="flex flex-row justify-between">
                <div className="flex flex-row items-center gap-1">
                  <Icon className="text-xl" icon="ph:user-circle" />
                  <div>
                    <div className="flex flex-row items-center gap-1 font-semibold">
                      {comment.userUsername == session.data?.user?.username
                        ? "You"
                        : comment.User.firstName + " " + comment.User.lastName}
                    </div>
                  </div>
                </div>
                <div>{new Date(comment.dateCreated).toLocaleString()}</div>
              </div>
              <p className="ml-6">{comment.text}</p>
            </motion.div>
          ))}
          <motion.div className="flex flex-col items-end gap-2" variants={item}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message..."
              rows={4}
              cols={50}
              style={{ color: "black" }}
              className="w-full rounded-2xl bg-lime-200 p-3 outline-none placeholder:text-black placeholder:text-opacity-40"
            />
            <GreenButton onClick={handleSubmit}>
              <Icon icon="ph:paper-plane-tilt-bold" />
              Send
            </GreenButton>
          </motion.div>
        </motion.div>
      </div>
      <Modal visible={visible} setVisible={setVisible} title="Oops...">
        Please type a message before clicking send.
      </Modal>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { props: {} };
  }

  try {
    const ticketId = Number(context.params?.id) || -1;

    // Fetch ticket details
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    // Fetch comments associated with the ticket
    const messages = await prisma.message.findMany({
      where: { ticketId: ticketId },
      include: { User: true },
    });

    return {
      props: {
        ticket,
        messages,
      },
    };
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    return { props: { error: "Failed to fetch ticket details" } };
  }
};
