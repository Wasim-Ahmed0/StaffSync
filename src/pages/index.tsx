import Head from "next/head";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Announcement } from "@prisma/client";
import TimeAgo from "javascript-time-ago";

type Event = {
  type: string;
  icon: string;
  date: Date;
  title: string;
  text: string;
  linkTo?: string;
};

type Props = {
  events: Event[];
};

export default function Home({ events }: Props) {
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

  const timeAgo = new TimeAgo("en-US");

  return (
    <>
      <Head>
        <title>StaffSync - Home</title>
      </Head>
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl font-semibold">Home</h1>
        <motion.div
          className="flex flex-col gap-2"
          initial="hidden"
          animate="visible"
          variants={list}
        >
          {events.map(({ type, icon, date, title, text, linkTo }, index) => (
            <motion.div variants={item} key={index}>
              <Link
                scroll={false}
                href={linkTo ? linkTo : ""}
                className="flex flex-col gap-1 rounded-2xl bg-white bg-opacity-80 p-3 text-black"
              >
                <div className="flex flex-row items-center justify-between opacity-50">
                  <div className="flex flex-row items-center gap-1 text-sm font-semibold uppercase">
                    <Icon className="text-lg" icon={icon} />
                    {type}
                  </div>
                  <div className="flex flex-row items-center gap-1 font-medium ">
                    <Icon className="text-lg" icon="ph:clock" />
                    {timeAgo.format(date)}
                  </div>
                </div>
                <h1 className="text-2xl font-bold">{title}</h1>
                <p>{text}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const events: Event[] = [];

  if (session) {
    const user = await prisma.user.findUnique({
      where: {
        username: session.user.username,
      },
    });

    // pull in events of all types

    // welcome
    if (user) {
      events.push({
        type: "welcome",
        icon: "ph:hand-waving-bold",
        date: user.dateCreated,
        title: "Welcome to StaffSync!",
        text: "This is the Home page. Here, you can stay informed about all current happenings at a glance. The left sidebar provides easy access to all of StaffSync's functionality, including booking leave, document viewing, and accessing help.",
      });
    }

    // announcements
    var announcements: Announcement[];

    if (session?.user) {
      if (session.user.role === "HR") {
        announcements = await prisma.announcement.findMany();
      } else {
        announcements = await prisma.announcement.findMany({
          where: { role: { in: [session.user.role, "EMPLOYEE"] } },
        });
      }
    } else {
      announcements = [];
    }

    announcements.forEach((announcement) => {
      events.push({
        type: "announcements",
        icon: "ph:megaphone-bold",
        date: announcement.dateCreated,
        title: announcement.title,
        text: announcement.text,
        linkTo: "/announcements",
      });
    });

    // tickets
    const tickets = await prisma.ticket.findMany({
      where: {
        userUsername: session.user.username,
      },
    });

    tickets.forEach((ticket) => {
      events.push({
        type: "help",
        icon: "ph:chats-circle-bold",
        date: ticket.dateCreated,
        title: "You created a ticket (#" + ticket.id + ")",
        text: ticket.subject,
        linkTo: "/help/ticket/" + ticket.id,
      });
    });

    const messages = await prisma.message.findMany({
      where: {
        Ticket: {
          userUsername: session.user.username,
        },
        NOT: {
          userUsername: session.user.username,
        },
      },
      include: {
        User: true,
      },
    });

    messages.forEach((message) => {
      events.push({
        type: "help",
        icon: "ph:chats-circle-bold",
        date: message.dateCreated,
        title:
          "Message recieved from " +
          message.User.firstName +
          " " +
          message.User.lastName +
          " on Ticket #" +
          message.ticketId,
        text: message.text,
        linkTo: "/help/ticket/" + message.ticketId,
      });
    });

    // leave requests
    const leaveRequests = await prisma.leaveRequest.findMany({
      where: {
        userUsername: session.user.username,
      },
    });

    leaveRequests.forEach((leaveRequest) => {
      events.push({
        type: "leave",
        icon: "ph:airplane-takeoff-bold",
        date: leaveRequest.dateCreated,
        title: "You submitted a leave request",
        text:
          leaveRequest.startDate.toDateString() +
          " - " +
          leaveRequest.endDate.toDateString() +
          " (" +
          leaveRequest.reason +
          ")",
        linkTo: "/leave",
      });

      if (leaveRequest.dateResponded) {
        events.push({
          type: "leave",
          icon: "ph:airplane-takeoff-bold",
          date: leaveRequest.dateCreated,
          title:
            "Your leave request has been " +
            leaveRequest.requestStatus.toLowerCase(),
          text:
            leaveRequest.startDate.toDateString() +
            " - " +
            leaveRequest.endDate.toDateString() +
            " (" +
            leaveRequest.reason +
            ")",
          linkTo: "/leave",
        });
      }
    });

    // documents

    const documents = await prisma.document.findMany({
      where: {
        userUsername: session.user.username,
      },
      select: {
        id: true,
        filename: true,
        userUsername: true,
        dateCreated: true,
      },
    });

    documents.forEach((document) => {
      events.push({
        type: "documents",
        icon: "ph:file-text-bold",
        date: document.dateCreated,
        title: "A document was uploaded to your account",
        text: document.filename,
        linkTo: "/documents",
      });
    });
    events.sort((a, b) => a.date.getTime() - b.date.getTime()).reverse();
  }

  return { props: { events } };
};
