import Head from "next/head";
import axios from "axios";
import BackButton from "@/components/BackButton";
import { SetStateAction, useState } from "react";
import { useRouter } from "next/router";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Modal from "@/components/Modal";

export default function CreateUser() {
  // State for input fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("EMPLOYEE");

  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState(<></>);
  const [closeButton, setCloseButton] = useState(true);

  const router = useRouter();

  const handleCreate = async () => {
    if (!firstName || !lastName || !password || !email || !phoneNumber) {
      setTitle("Oops...");
      setMessage(<p>Please fill out all fields.</p>);
      setCloseButton(true);
      setVisible(true);
      return;
    }

    try {
      const response = await axios.post("/api/users/newUser", {
        firstName,
        lastName,
        password,
        email,
        phoneNumber,
        role,
      });

      if (response.status === 200) {
        setTitle("User created");
        setMessage(
          <div className="flex flex-col gap-3">
            <p>
              User was created successfully. Their User ID is{" "}
              <b>{response.data.username}</b>.
            </p>
            <Button onClick={() => router.push("/manage/users")}>OK</Button>
          </div>,
        );
        setCloseButton(false);
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
            "Error creating user: " +
              (data?.message || "An unexpected error occurred."),
          );
        }
      } else {
        console.error("Error creating user:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
      <Head>
        <title>StaffSync - Add User</title>
      </Head>
      <div className="flex flex-col gap-3">
        <BackButton />
        <div className="flex justify-between">
          <h1 className="text-4xl font-bold">Add User</h1>
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
              required
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setPhoneNumber(e.target.value)
              }
            />
          </div>
          <div className="flex flex-col">
            <label className="font-medium" htmlFor="userOptions">
              Choose User Role:
            </label>
            <select
              defaultValue={"EMPLOYEE"}
              id="userOptions"
              name="userOptions"
              required
              onChange={(e) => setRole(e.target.value)}
              className="rounded-xl bg-gray-200 bg-opacity-50 px-3 py-2 shadow-lg outline-none transition hover:bg-opacity-70"
            >
              <option value="EMPLOYEE">Employee</option>
              <option value="HR">HR Employee</option>
              <option value="TECHNICIAN">Technician</option>
            </select>
          </div>
          <div className="flex w-full justify-end">
            <Button onClick={handleCreate}>Submit</Button>
          </div>
        </div>
      </div>
      <Modal
        visible={visible}
        setVisible={setVisible}
        title={title}
        closeButton={closeButton}
      >
        {message}
      </Modal>
    </>
  );
}
