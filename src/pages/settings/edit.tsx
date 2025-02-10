import Head from "next/head";
import { useRouter } from "next/router";
import { SetStateAction, useState } from "react";
import prisma from "@/lib/prisma";
import { GetServerSidePropsContext } from "next";
import { User } from "@prisma/client";
import { getSession, useSession } from "next-auth/react";
import BackButton from "@/components/BackButton";
import axios from "axios";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { useEffect } from "react";

type Props = {
  user: User | null;
};

export default function PersonalInfo({ user }: Props) {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(<></>);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPhoneNumber(user.phoneNumber);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  // Handle Update Info button click
  const handleUpdate = async () => {
    try {
      // Send a POST request to the updateUser API endpoint
      const response = await axios.post("/api/users/updateUserInfo", {
        username: user?.username,
        firstName,
        lastName,
        password,
        email,
        phoneNumber,
      });

      if (response.status === 200) {
        setMessage(
          <div className="flex flex-col gap-3">
            <p>Your personal information was successfully updated.</p>
            <Button
              onClick={async () => {
                await update({ firstName, lastName });
                await router.push("/settings");
                window.location.reload();
              }}
            >
              OK
            </Button>
          </div>,
        );
        setVisible(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        // If status code is 409, means the email / phone num already in use
        if (status === 409) {
          alert(data.message);
        } else {
          alert(
            "Error updating user: " +
              (data?.message || "An unexpected error occurred."),
          );
        }
      } else {
        console.error("Error updating user:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <Head>
        <title>StaffSync - Edit Personal Information</title>
      </Head>
      <div className="flex flex-col gap-5">
        <BackButton />
        <div className="flex justify-between">
          <h1 className="text-4xl font-semibold">Edit Personal Information</h1>
        </div>
        <div className="flex flex-col gap-3 rounded-2xl bg-white bg-opacity-80 p-3 text-black">
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="fname">
              First Name
            </label>
            <Input
              type="text"
              name="fname"
              id="fname"
              defaultValue={firstName}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setFirstName(e.target.value)
              }
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="lname">
              Last Name
            </label>
            <Input
              type="text"
              name="lname"
              id="lname"
              defaultValue={lastName}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setLastName(e.target.value)
              }
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="password">
              Password
            </label>
            <Input
              type="password"
              name="password"
              id="password"
              placeholder="***********"
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setPassword(e.target.value)
              }
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="email">
              Email Address
            </label>
            <Input
              type="email"
              name="email"
              id="email"
              defaultValue={email}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setEmail(e.target.value)
              }
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="phone">
              Mobile Number
            </label>
            <Input
              type="tel"
              name="phone"
              id="phone"
              defaultValue={phoneNumber}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setPhoneNumber(e.target.value)
              }
            />
          </div>
          <div className="flex w-full justify-end">
            <Button onClick={handleUpdate}>Save Changes</Button>
          </div>
        </div>
      </div>
      <Modal
        visible={visible}
        setVisible={setVisible}
        title="Changes saved"
        closeButton={false}
      >
        {message}
      </Modal>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session || !prisma) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      username: session.user?.username,
    },
  });

  if (!user) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
}
