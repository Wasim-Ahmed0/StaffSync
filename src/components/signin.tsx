import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Head from "next/head";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import fdmLogo from "../../public/fdm.svg";
import Modal from "./Modal";

export default function SignIn() {
  const router = useRouter();
  const [incorrectLogin, setIncorrectLogin] = useState(false);
  const [popup, setPopup] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      callbackUrl: "/",
      redirect: false,
    });

    if (result) {
      if (result.ok) {
        setIncorrectLogin(false);
        router.push(router.pathname);
      } else {
        setIncorrectLogin(true);
      }
    }
  }

  return (
    <>
      <Head>
        <title>StaffSync - Sign in</title>
      </Head>
      <div className="flex h-dvh flex-col items-center justify-center gap-10 font-medium">
        <div className="flex flex-row items-center gap-3">
          <Image src={fdmLogo} alt="FDM" className="mx-auto mb-1 w-24" />
          <h1 className="flex gap-3 text-4xl font-bold text-white drop-shadow">
            StaffSync
          </h1>
        </div>
        <div className="flex flex-col gap-5 rounded-2xl bg-white bg-opacity-80 p-5 text-center shadow backdrop-blur-md">
          <div className="text-left font-semibold">
            <h1 className="flex items-center gap-2 text-3xl">
              <Icon icon="ph:users-three-bold" />
              Sign in
            </h1>
            <h2 className="pl-10 text-sm">Please enter your credentials</h2>
          </div>
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            <label className="flex flex-col text-left">
              <div className="flex flex-row items-center gap-1">
                <Icon icon="ph:user-bold" />
                User ID
              </div>
              <Input name="username" type="text" placeholder="User ID" />
            </label>
            <label className="flex flex-col text-left">
              <div className="flex flex-row items-center gap-1">
                <Icon icon="ph:key-bold" />
                Password
              </div>
              <Input name="password" type="password" placeholder="Password" />
            </label>
            {incorrectLogin && (
              <p className="text-sm text-red-700 drop-shadow-sm">
                User ID or password incorrect
              </p>
            )}
            <div className="flex flex-col gap-2">
              <Button type="submit">
                Sign in
                <Icon
                  icon="ph:arrow-right-bold"
                  className="group-hover:ml-1"
                ></Icon>
              </Button>
              <div
                className="cursor-pointer text-sm text-neutral-600 underline transition-colors hover:text-neutral-500"
                onClick={() => setPopup(true)}
              >
                Having trouble signing in?
              </div>
            </div>
          </form>
        </div>
      </div>
      <Modal
        visible={popup}
        setVisible={setPopup}
        title="Having trouble signing in?"
      >
        <div className="flex flex-col gap-2">
          <p>
            Your User ID is a 5 digit number which should have been provided to
            you upon joining.
          </p>
          <p>
            If you have forgotten or otherwise do not have access to your User
            ID or Password, please contact your system administrator for further
            guidance.
          </p>
        </div>
      </Modal>
    </>
  );
}
