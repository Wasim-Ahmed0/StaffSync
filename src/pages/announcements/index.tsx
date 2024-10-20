import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { Announcement, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import prisma from "../../lib/prisma";
import GreenButton from "@/components/GreenButton";
import { GetServerSideProps } from "next";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Button from "@/components/Button";

//Gets all the announcements from the prisma database to be outputted before rendering the page
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
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

  return {
    props: {
      initialAnnouncements: announcements,
    },
  };
};

//Deleting announcement utilising the announcements/delete.ts API endpoint using announcementID
//DELETE method was not working so implemented POST method instead
async function deleteAnnouncement(announcementID: number) {
  const response = await fetch("api/announcements/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ announcementID }),
  });
  //Ensuring that any issues are being outputted
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
}

//Main function used to render the page
export default function Announcements({
  initialAnnouncements,
}: {
  initialAnnouncements: Announcement[];
}) {
  //Stores all announcements from the database
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(initialAnnouncements);
  //Utilising the role from the session based on the user login
  const session = useSession();
  //State checking the filter being applied using the dropdown menu for HR employees
  const [filter, setFilter] = useState("");
  //State used that checks if the announcement has been clicked to get further details
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  //Used to ensure that the date outputted is in a readable form
  const converttoReadable = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const readable = date.toLocaleString("en-GB", options);
    return readable;
  };
  //Used to signify the expansion or collapse of a announcement details
  const toggleCollapse = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  //Used to change the filter value changing based on the HR employee filtering
  const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };
  //Dealing with the announcement deletion by calling "deleteAnnouncement" and removing the announcement from the page rendered
  const handleDeleteAnnouncement = async (announcementID: number) => {
    try {
      await deleteAnnouncement(announcementID);
      const updated = announcements.filter(
        (announcement) => announcement.id != announcementID,
      );
      setAnnouncements(updated);
      return true;
    } catch (error) {
      console.error("Error deleting announcement: ", error);
      return false;
    }
  };

  //All constants deal with the content for each of the roles and also for the HR employee filter functionality implemented
  const filteredContent = filter
    ? announcements.filter((announcement) => announcement.role === filter)
    : announcements;

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

  if (session.data && session.data.user) {
    return (
      <>
        <Head>
          <title>StaffSync - Announcements</title>
        </Head>
        <div className="flex grow flex-col gap-5">
          <div>
            <div className="flex flex-row justify-between gap-3 max-md:flex-col">
              <h1 className="text-4xl font-semibold">Announcements</h1>
              <div>
                <div className="flex flex-row gap-3 max-md:flex-col">
                  {(session.data.user.role == "HR" ||
                    session.data.user.role == "TECHNICIAN") && (
                    <select
                      className="flex items-center justify-center gap-1 rounded-full bg-gray-200 px-3 py-2 font-medium text-black shadow-lg transition hover:bg-opacity-90 active:bg-white active:bg-opacity-70"
                      onChange={handleFilterChange}
                    >
                      <option value="">No Filter</option>
                      <option value="EMPLOYEE">All Users</option>
                      <option value="HR">HR Employee</option>
                      <option value="TECHNICIAN">Technician</option>
                    </select>
                  )}
                  {session.data.user.role == "HR" && (
                    <Link
                      scroll={false}
                      href="/announcements/new"
                      className="flex w-full flex-col"
                    >
                      <GreenButton>Create Announcement</GreenButton>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
          {announcements.length == 0 ? (
            <div className="flex grow flex-col items-center justify-center gap-2 text-center text-neutral-400">
              <Icon icon="ph:megaphone-light" width="8em" />
              <h1 className="text-2xl font-semibold">No announcements</h1>
              {session.data.user.role == "HR" && (
                <p className="text-neutral-500">
                  Click &apos;Create Announcement&apos; in the top right to
                  create one.
                </p>
              )}
            </div>
          ) : filteredContent.length == 0 ? (
            <div className="flex grow flex-col items-center justify-center gap-2 text-center text-neutral-400">
              <Icon icon="ph:funnel-light" width="8em" />
              <h1 className="text-2xl font-semibold">
                No announcements matching filter
              </h1>
              <p className="text-neutral-500">
                Try selecting a different filter in the top right.
              </p>
            </div>
          ) : (
            <motion.div
              className="flex flex-col gap-2"
              initial="hidden"
              animate="visible"
              variants={list}
            >
              {/*Displaying the announcements only for the HR employee to view as necessary*/}
              {filteredContent
                .slice()
                .reverse()
                .map((announcement, index) => (
                  <motion.div
                    className="flex flex-col gap-2 rounded-2xl bg-white bg-opacity-80 p-2 text-black"
                    variants={item}
                    key={announcement.id}
                  >
                    {/* Subject of each announcement represented as the button to be pressed to expand and collapse the text for each announcement */}
                    <button
                      type="button"
                      className={`w-full p-1 text-left transition-colors duration-300 ${expandedIndex === index ? "active" : ""} `}
                      onClick={() => toggleCollapse(index)}
                    >
                      <h1 className="text-2xl font-bold">
                        {announcement.title}
                      </h1>
                      <h2 className="font-medium">
                        {converttoReadable(new Date(announcement.dateCreated))}
                      </h2>
                    </button>
                    <div
                      className={`relative flex flex-col overflow-hidden border-t border-black border-opacity-50 p-2 text-black ${expandedIndex === index ? "" : "hidden"}`}
                    >
                      {/* Outputs text for the announcement and also the date it was created in a readable format */}
                      <p className="mt-1 max-h-64 overflow-auto">
                        {announcement.text}
                      </p>
                      {/* Remove button only for HR employees to remove announcements as necessary */}
                      {session?.data?.user?.role == "HR" && (
                        <div className="flex justify-end">
                          <Button
                            onClick={() =>
                              handleDeleteAnnouncement(announcement.id)
                            }
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          )}
        </div>
      </>
    );
  }
}
