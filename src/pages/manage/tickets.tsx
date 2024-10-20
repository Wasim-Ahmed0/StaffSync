import Head from "next/head";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { Ticket } from "@prisma/client";
import TicketList from "@/components/TicketList";
import { useState } from "react";
import { Icon } from "@iconify/react";

type Props = {
  tickets: Ticket[];
};

export default function ManageTickets({ tickets }: Props) {
  const [filter, setFilter] = useState("Unresolved");

  const filteredTickets =
    filter == ""
      ? tickets
      : tickets.filter((ticket: Ticket) => ticket.status == filter);

  return (
    <>
      <Head>
        <title>StaffSync - Manage Tickets</title>
      </Head>
      <div className="flex grow flex-col gap-5">
        <div className="flex flex-row justify-between gap-2 max-md:flex-col">
          <h1 className="text-4xl font-semibold">Manage Tickets</h1>
          <select
            className="flex items-center justify-center gap-1 rounded-full bg-gray-200 px-3 py-2 font-medium text-black shadow-lg transition hover:bg-opacity-90 active:bg-white active:bg-opacity-70"
            onChange={(e) => setFilter(e.target.value)}
            defaultValue="Unresolved"
          >
            <option value="">No Filter</option>
            <option value="Unresolved">Unresolved</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        {tickets.length == 0 ? (
          <div className="flex grow flex-col items-center justify-center gap-2 text-center text-neutral-400">
            <Icon icon="ph:ticket-light" width="8em" />
            <h1 className="text-2xl font-semibold">No tickets</h1>
            <p className="text-neutral-500">Maybe check back later?</p>
          </div>
        ) : filteredTickets.length == 0 ? (
          <div className="flex grow flex-col items-center justify-center gap-2 text-center text-neutral-400">
            <Icon icon="ph:funnel-light" width="8em" />
            <h1 className="text-2xl font-semibold">
              No tickets matching filter
            </h1>
            <p className="text-neutral-500">
              Try selecting a different filter in the top right.
            </p>
          </div>
        ) : (
          <TicketList tickets={filteredTickets} />
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    const tickets = await prisma.ticket.findMany();

    return { props: { tickets } };
  } else {
    return { props: {} };
  }
};
