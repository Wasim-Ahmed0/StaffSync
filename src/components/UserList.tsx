import Link from "next/link";
import { Icon } from "@iconify/react";
import { User } from "@prisma/client";
import { motion } from "framer-motion";

type Props = {
  users: User[];
  query: string;
};

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

export default function UserList({ users, query }: Props) {
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
                href={`/manage/users/user/${user.username}`}
                className="flex flex-col items-start rounded-2xl bg-white bg-opacity-80 p-3 text-black"
              >
                <div className="flex w-full justify-between">
                  <h1 className="flex items-center gap-1 text-xl font-semibold">
                    <Icon icon="ph:user-bold"></Icon> {user.firstName}{" "}
                    {user.lastName}
                  </h1>
                  <p>
                    {user.role == "EMPLOYEE"
                      ? "Employee"
                      : user.role == "HR"
                        ? "HR Employee"
                        : user.role == "TECHNICIAN"
                          ? "Technician"
                          : ""}
                  </p>
                </div>
                <p className="text-sm font-medium text-neutral-600">
                  <b>User ID:</b> {user.username}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
}
