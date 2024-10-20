import Link from "next/link";
import { Ticket } from "@prisma/client";
import { motion } from "framer-motion";
import TicketStatus from "./TicketStatus";

type Props = {
  tickets: Ticket[];
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

export default function TicketList({ tickets }: Props) {
  return (
    <motion.div
      className="flex flex-col gap-2"
      initial="hidden"
      animate="visible"
      variants={list}
    >
      {tickets.map((ticket) => (
        <motion.div key={ticket.id} variants={item} className="flex flex-col">
          <Link
            scroll={false}
            href={`/help/ticket/${ticket.id}`}
            className="flex flex-row items-start justify-between gap-3 rounded-2xl bg-white bg-opacity-80 p-3 text-black max-md:flex-col"
          >
            <div>
              <h1 className="text-xl font-semibold">
                <span className="font-normal text-neutral-600">
                  #{ticket.id}{" "}
                </span>
                {ticket.subject}
              </h1>{" "}
              {ticket.dateCreated.toLocaleString()}
            </div>
            <TicketStatus status={ticket.status} />
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
