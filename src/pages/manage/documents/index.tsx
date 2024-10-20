import { Prisma, User } from "@prisma/client";
import { GetServerSideProps } from "next";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Head from "next/head";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Input from "@/components/Input";
import { SetStateAction, useState } from "react";

const userWithDocumentCount = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    _count: {
      select: { documents: true },
    },
  },
});

type UserWithDocumentCount = Prisma.UserGetPayload<
  typeof userWithDocumentCount
>;

type Props = {
  users: UserWithDocumentCount[];
};

export default function ManageDocuments({ users }: Props) {
  const [query, setQuery] = useState("");

  const list = {
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.035,
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

  const filteredUsers = users.filter((user) => {
    return (
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      (
        user.firstName.toLowerCase() +
        " " +
        user.lastName.toLowerCase()
      ).includes(query.toLowerCase())
    );
  });

  return (
    <>
      <Head>
        <title>StaffSync - Manage Documents</title>
      </Head>
      <h1 className="mb-3 text-4xl font-semibold">Manage Documents</h1>
      <div className="flex grow flex-col gap-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <Input
          placeholder="Search for users..."
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setQuery(e.target.value)
          }
        ></Input>
        {filteredUsers.length == 0 ? (
          <div className="flex grow flex-col items-center justify-center gap-2 text-center text-neutral-400">
            <Icon icon="ph:magnifying-glass-light" width="8em" />
            <h1 className="text-2xl font-semibold">No users found</h1>
            <p className="text-neutral-500">
              Maybe try a different search query?
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 gap-2 max-md:grid-cols-1"
            initial="hidden"
            animate="visible"
            variants={list}
          >
            {filteredUsers.map((user) => (
              <motion.div
                key={user.username}
                variants={item}
                className="flex flex-col"
              >
                <Link
                  scroll={false}
                  className="rounded-2xl bg-white bg-opacity-80 p-3 text-black hover:cursor-pointer"
                  href={`/manage/documents/user/${user.username}`}
                >
                  <h1 className="flex items-center gap-1 text-xl font-semibold">
                    <Icon icon="ph:user-bold"></Icon> {user.firstName}{" "}
                    {user.lastName}
                  </h1>
                  <p>
                    {user._count.documents}{" "}
                    {user._count.documents == 1 ? "document" : "documents"}{" "}
                    uploaded
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { documents: true },
      },
    },
  });
  return { props: { users } };
};
