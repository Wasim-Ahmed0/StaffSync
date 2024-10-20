import Head from "next/head";
import { signOut } from "next-auth/react";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import GreenButton from "@/components/GreenButton";
import { Icon } from "@iconify/react";
import { GetServerSidePropsContext } from "next";
import { getSession } from "next-auth/react";
import prisma from "@/lib/prisma";

type Props = {
  user: User;
};

export default function Settings({ user }: Props) {
  const router = useRouter();

  const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: "/" });
    router.push(data.url);
  };

  return (
    <>
      <Head>
        <title>StaffSync - Settings</title>
      </Head>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-row items-center justify-between gap-3 max-md:flex-col">
            <div className="flex flex-row items-center gap-3">
              <Icon icon="ph:user-circle-light" className="text-8xl" />
              <div className="flex flex-col gap-1">
                <p className="text-5xl font-semibold">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-lg font-medium text-neutral-300">
                  {user.role == "EMPLOYEE"
                    ? "Employee"
                    : user.role == "HR"
                      ? "HR Employee"
                      : user.role == "TECHNICIAN"
                        ? "Technician"
                        : ""}
                </p>
              </div>
            </div>
            <div className="flex flex-col max-md:w-full">
              <GreenButton onClick={() => router.push("/settings/edit")}>
                Edit Personal Information
              </GreenButton>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <ProfileCard label="User ID" value={user.username} />
            <ProfileCard label="Email" value={user.email} />
            <ProfileCard label="Phone Number" value={user.phoneNumber} />
            <ProfileCard
              label="Account created"
              value={user.dateCreated.toLocaleDateString()}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            className="flex items-center justify-center gap-1 rounded-full bg-red-600 px-3 py-2 font-medium text-white shadow-lg transition hover:bg-white hover:text-black active:bg-white active:bg-opacity-70"
            onClick={handleSignOut}
          >
            <Icon icon="ph:door-open-bold" />
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}

const ProfileCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="rounded-2xl bg-white bg-opacity-80 p-3 text-black">
      <p className="text-lg font-semibold">{label}</p>
      <p>{value}</p>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      props: {},
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      username: session.user?.username,
    },
  });

  return {
    props: {
      user,
    },
  };
}
