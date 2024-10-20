import Head from "next/head";
import axios from "axios";
import { SetStateAction, useState } from "react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { User } from "@prisma/client";
import BackButton from "@/components/BackButton";
import prisma from "@/lib/prisma";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Modal from "@/components/Modal";

type Props = {
  user: User;
};

export default function EditUser({ user }: Props) {
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const router = useRouter();

  // State for input fields
  const [userName, setUserName] = useState(user.username);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState(<></>);

  // Handle Update Info button click
  const handleUpdate = async () => {
    // If all fields blank don't update
    if (!firstName && !lastName && !password && !email && !phoneNumber) {
      setTitle("Oops...");
      setMessage(<p>Nothing was saved, as there were no changes made.</p>);
      setVisible(true);
      return;
    }

    try {
      // Send a POST request to the updateUser API endpoint
      const response = await axios.post("/api/users/updateUser", {
        username: userName,
        firstName,
        lastName,
        password,
        email,
        phoneNumber,
      });

      if (response.status === 200) {
        router.push("/manage/users");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        // If status code is 409, means the email / phone num already in use
        if (status === 409) {
          setTitle("Oops...");
          setMessage(<p>{data.message}</p>);
          setVisible(true);
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

  const deleteUser = async () => {
    setVisible(false);

    try {
      // Send a DELETE request to the deleteUser API endpoint
      const response = await axios.delete("/api/users/deleteUser", {
        data: { username: userName },
      });

      if (response.status === 200) {
        router.push("/manage/users");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        alert(
          "Error deleting user: " +
            (data?.message || "An unexpected error occurred."),
        );
      } else {
        console.error("Error deleting user:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Handle Delete Info button click
  const handleDelete = async () => {
    setTitle("Delete User");
    setMessage(
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this user?</p>
          <p>
            If you continue, all data associated with this user will be removed.
          </p>
        </div>
        <div className="flex flex-row justify-end gap-2 max-md:flex-col">
          <button
            onClick={deleteUser}
            className="flex items-center justify-center gap-1 rounded-full bg-red-600 px-3 py-2 font-medium text-white shadow-lg transition hover:bg-black active:bg-black active:bg-opacity-70"
          >
            Yes, delete this user
          </button>
          <Button onClick={() => setVisible(false)}>No, go back</Button>
        </div>
      </div>,
    );
    setVisible(true);
  };

  return (
    <>
      <Head>
        <title>
          StaffSync - Edit User - {user.firstName} {user.lastName}
        </title>
      </Head>
      <div className="flex flex-col gap-3">
        <BackButton />
        <div className="flex justify-between gap-2 max-md:flex-col">
          <h1 className="text-4xl font-semibold">
            Edit User - {user.firstName} {user.lastName}
          </h1>
          <div className="flex gap-3">
            {userRole === "TECHNICIAN" && (
              <button
                onClick={handleDelete}
                className="flex w-full items-center justify-center gap-1 rounded-full bg-red-600 px-3 py-2 font-medium text-white shadow-lg transition hover:bg-white hover:text-black active:bg-white active:bg-opacity-70"
              >
                Delete User
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl bg-white bg-opacity-80 p-3 text-black">
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="uname">
              User ID
            </label>
            <Input
              type="text"
              name="uname"
              id="uname"
              placeholder={user.username}
              disabled
              required
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setFirstName(e.target.value)
              }
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="fname">
              First Name
            </label>
            <Input
              type="text"
              name="fname"
              id="fname"
              placeholder={user.firstName}
              required
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
              placeholder={user.lastName}
              required
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
              required
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
              placeholder={user.email}
              required
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
              placeholder={user.phoneNumber}
              required
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
      <Modal visible={visible} setVisible={setVisible} title={title}>
        {message}
      </Modal>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { props: {} };
  }

  try {
    const username = context.params?.username as string;

    const user = await prisma.user.findUnique({
      where: {
        username: String(username),
      },
    });

    return {
      props: {
        user,
      },
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    return { props: { error: "Failed to fetch user details" } };
  }
};
