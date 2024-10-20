import Head from "next/head";
import { FormEvent, useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Icon } from "@iconify/react";
import Router from "next/router";
import BackButton from "@/components/BackButton";
import Modal from "@/components/Modal";

export default function NewAnnouncement() {
  const [visible, setVisible] = useState(false);
  //Saving announcements utilising the announcements/create.ts API endpoint
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const title = formData.get("title");
    const text = formData.get("text");
    const role = formData.get("role");

    if (title == "" || text == "") {
      setVisible(true);
      return;
    }

    const response = await fetch("/api/announcements/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, text, role }),
    });

    //Ensuring that any issues are being outputted
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    await Router.push("/announcements");
  }

  return (
    <>
      <Head>
        <title>StaffSync - New Announcement</title>
      </Head>
      <div className="flex flex-col gap-3">
        <BackButton />
        <h1 className="text-4xl font-bold">New Announcement</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col text-left">
            Title
            <Input name="title" type="text" />
          </label>
          <label className="flex flex-col text-left">
            Text
            <Input name="text" type="text" />
          </label>
          <label className="flex flex-col text-left">
            User Type
            <select
              defaultValue={"EMPLOYEE"}
              id="role"
              name="role"
              required
              className="rounded-xl bg-gray-200 bg-opacity-50 px-3 py-2 shadow-lg outline-none transition hover:bg-opacity-70"
            >
              <option value="EMPLOYEE">All Users</option>
              <option value="HR">HR Employee</option>
              <option value="TECHNICIAN">Technician</option>
            </select>
          </label>
          <Button type="submit">
            Submit <Icon icon="ph:arrow-right-bold"></Icon>
          </Button>
        </form>
      </div>
      <Modal visible={visible} setVisible={setVisible} title="Oops...">
        Please fill out both the title and text first.
      </Modal>
    </>
  );
}
