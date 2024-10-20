import Head from "next/head";
import { FormEvent, useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Icon } from "@iconify/react";
import Router from "next/router";
import BackButton from "@/components/BackButton";
import Modal from "@/components/Modal";

export default function NewTicket() {
  const [visible, setVisible] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const subject = formData.get("subject");
    const description = formData.get("description");

    if (subject == "" || description == "") {
      setVisible(true);
      return;
    }

    await fetch("/api/tickets/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, description }),
    });

    await Router.push("/help");
  }
  return (
    <>
      <Head>
        <title>StaffSync - Help</title>
      </Head>
      <div className="flex flex-col gap-3">
        <BackButton />
        <h1 className="text-4xl font-bold">New Ticket</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <label className="flex flex-col text-left">
            Subject
            <Input name="subject" type="text" />
          </label>
          <label className="flex flex-col text-left">
            Description
            <Input name="description" type="text" />
          </label>
          <Button type="submit">
            Submit <Icon icon="ph:arrow-right-bold"></Icon>
          </Button>
        </form>
      </div>
      <Modal visible={visible} setVisible={setVisible} title="Oops...">
        Please fill out both the subject and description first.
      </Modal>
    </>
  );
}
