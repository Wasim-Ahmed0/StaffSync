import Head from "next/head";
import { SetStateAction, useEffect, useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { Icon } from "@iconify/react";
import Router from "next/router";
import BackButton from "@/components/BackButton";
import { useSession } from "next-auth/react";
import Modal from "@/components/Modal";

export default function NewLeaveRequest() {
  const { data: session } = useSession();
  const [balance, setBalance] = useState(0);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(
          `/api/leaveRequests/getleavebalance?username=${session?.user?.username}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch leave balance");
        }
        const data = await response.json();
        setBalance(data.leaveBalance);
      } catch (error) {
        console.error("Error fetching leave balance:", error);
      }
    };

    fetchBalance();
  }, [session]);

  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const calculateDaysRequested = () => {
    if (!startDate || !endDate) {
      return 0;
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const difference = end.getTime() - start.getTime();
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

    return days > 0 ? days : 0;
  };

  const handleSubmit = async () => {
    const daysRequested = calculateDaysRequested();
    if (daysRequested > balance) {
      setMessage("Days requested exceed remaining balance.");
      setVisible(true);
      return;
    }

    if (!reason || !startDate || !endDate) {
      setMessage("Please fill in all fields.");
      setVisible(true);
      return;
    }

    const formattedStartDate1 = new Date(startDate);
    const formattedEndDate1 = new Date(endDate);
    if (formattedStartDate1 >= formattedEndDate1) {
      setMessage("Start date must be before end date.");
      setVisible(true);
      return;
    }

    if (formattedStartDate1 < new Date()) {
      setMessage("Start date must not be in the past.");
      setVisible(true);
      return;
    }

    const formattedStartDate = new Date(startDate + "T00:00:00");
    const formattedEndDate = new Date(endDate + "T00:00:00");
    const requestData = {
      reason,
      startDate: formattedStartDate.toISOString(),
      endDate: formattedEndDate.toISOString(),
      userUsername: session?.user?.username,
    };

    try {
      const response = await fetch("/api/leaveRequests/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      await Router.push("/leave");
    } catch (error) {
      console.error("There was an error!", error);
      alert("Please Try Again");
    }
  };
  return (
    <>
      <Head>
        <title>StaffSync - New Leave Request</title>
      </Head>
      <div className="flex flex-col gap-3">
        <BackButton />
        <h1 className="text-4xl font-semibold">New Leave Request</h1>
        <div className="flex flex-col gap-5">
          <label className="flex flex-col text-left">
            Reason:
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="rounded-xl bg-gray-200 bg-opacity-50 px-3 py-2 shadow-lg outline-none transition hover:bg-opacity-70"
            >
              <option value="Empty">Select a Reason</option>
              <option value="Holiday">Holiday</option>
              <option value="Sick">Sick Leave</option>
              <option value="Parental">Parental Leave</option>
              <option value="Study">Study Leave</option>
              <option value="Training">Training Leave</option>
              <option value="Family">Family Leave</option>
            </select>
          </label>

          <label className="flex flex-col text-left">
            Start Date:
            <Input
              type="date"
              value={startDate}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setStartDate(e.target.value)
              }
            />
          </label>

          <label className="flex flex-col text-left">
            End Date:
            <Input
              type="date"
              value={endDate}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setEndDate(e.target.value)
              }
            />
          </label>

          <p
            className={calculateDaysRequested() > balance ? "text-red-500" : ""}
          >
            Days Requested: {calculateDaysRequested()}
          </p>
          {calculateDaysRequested() > balance ? (
            <p className="text-red-500">Leave Balance Limit Reached</p>
          ) : (
            ""
          )}
          <Button onClick={handleSubmit}>
            Submit <Icon icon="ph:arrow-right-bold"></Icon>
          </Button>
        </div>
      </div>
      <Modal visible={visible} setVisible={setVisible} title="Oops...">
        {message}
      </Modal>
    </>
  );
}
