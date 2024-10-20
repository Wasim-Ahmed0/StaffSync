import Head from "next/head";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import { Ticket } from "@prisma/client";
import GreenButton from "@/components/GreenButton";
import TicketList from "@/components/TicketList";
import { Icon } from "@iconify/react";

type Props = {
  tickets: Ticket[];
};

export default function Help({ tickets }: Props) {
  return (
    <>
      <Head>
        <title>StaffSync - Help</title>
      </Head>
      <div className="flex grow flex-col gap-5">
        <div className="flex justify-between">
          <h1 className="text-4xl font-semibold">Help</h1>
          <Link scroll={false} href="/help/new">
            <GreenButton>New Ticket</GreenButton>
          </Link>
        </div>
        {tickets.length == 0 ? (
          <div className="flex grow flex-col items-center justify-center gap-2 text-center text-neutral-400">
            <Icon icon="ph:chats-circle-light" width="8em" />
            <h1 className="text-2xl font-semibold">No tickets</h1>
            <p className="text-neutral-500">
              Need help? Click &apos;New Ticket&apos; in the top right.
            </p>
          </div>
        ) : (
          <TicketList tickets={tickets} />
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    const tickets = await prisma.ticket.findMany({
      where: {
        userUsername: session.user.username,
      },
    });

    return { props: { tickets } };
  } else {
    return { props: {} };
  }
};
