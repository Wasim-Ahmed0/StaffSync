import Head from "next/head";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import GreenButton from "@/components/GreenButton";
import UserList from "@/components/UserList";
import Input from "@/components/Input";
import { SetStateAction, useState } from "react";

type Props = {
  users: User[];
};

export default function ManageUsers({ users }: Props) {
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const [query, setQuery] = useState("");

  return (
    <>
      <Head>
        <title>StaffSync - Manage Users</title>
      </Head>
      <div className="flex grow flex-col gap-5">
        <div className="flex justify-between">
          <h1 className="text-4xl font-semibold">Manage Users</h1>
          {userRole === "TECHNICIAN" && (
            <Link scroll={false} href="/manage/users/new">
              <GreenButton>Add User</GreenButton>
            </Link>
          )}
        </div>
        <Input
          placeholder="Search for users..."
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setQuery(e.target.value)
          }
        ></Input>
        <UserList users={users} query={query} />
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    const users = await prisma.user.findMany();

    return { props: { users } };
  } else {
    return { props: {} };
  }
};
