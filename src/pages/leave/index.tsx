import Head from "next/head";
import LeaveCard from "@/components/LeaveCard";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { LeaveRequest } from "@prisma/client";
import GreenButton from "@/components/GreenButton";
import { motion } from "framer-motion";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function Leave() {
  const { data: session } = useSession();

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [totalLeaveDuration, setTotalLeaveDuration] = useState(0);

  useEffect(() => {
    const fetchLeaveRequests = () => {
      fetch(`/api/leaveRequests?userUsername=${session?.user?.username}`)
        .then((res) => res.json())
        .then((data: any) => {
          const sortedData = data.sort(
            (a: { startDate: string }, b: { startDate: string }) => {
              const dateA = new Date(a.startDate);
              const dateB = new Date(b.startDate);
              return dateA.getTime() - dateB.getTime();
            },
          );
          setLeaveRequests(sortedData);

          let totalDuration = 0;
          sortedData.forEach((request: any) => {
            if (request.requestStatus !== "Declined") {
              const duration = calculateDurationInDays(
                request.startDate,
                request.endDate,
              );
              totalDuration += duration;
            }
          });
          setTotalLeaveDuration(totalDuration);
        })
        .catch((error) => {
          console.error("Error fetching leave requests:", error);
        });
    };

    fetchLeaveRequests();
  }, [session]);

  const calculateDurationInDays = (
    startDate: string,
    endDate: string,
  ): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInMilliseconds = end.getTime() - start.getTime();
    const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);
    return Math.round(durationInDays);
  };

  const [balance, setBalance] = useState(0);

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

  const list = {
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
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

  return (
    <>
      <Head>
        <title>StaffSync - Leave</title>
      </Head>
      <div className="flex grow flex-col gap-5">
        <div className="flex justify-between">
          <h1 className="text-4xl font-semibold">Leave</h1>
          <Link scroll={false} href="/leave/new">
            <GreenButton>New Leave Request</GreenButton>
          </Link>
        </div>
        <div>
          <h1>
            <b>Leave Balance:</b> Granted: {balance} days | Used:{" "}
            {totalLeaveDuration} days | Remaining:{" "}
            {balance - totalLeaveDuration} days
          </h1>
        </div>
        {leaveRequests.length == 0 ? (
          <div className="flex grow flex-col items-center justify-center gap-2 text-center text-neutral-400">
            <Icon icon="ph:airplane-takeoff-light" width="8em" />
            <h1 className="text-2xl font-semibold">No leave requests</h1>
            <p className="text-neutral-500">
              Click &apos;New Leave Request&apos; in the top right to create
              one.
            </p>
          </div>
        ) : (
          <motion.div
            className="flex flex-col gap-2"
            initial="hidden"
            animate="visible"
            variants={list}
          >
            {leaveRequests.map((leave, index) => (
              <motion.div key={leave.id} variants={item}>
                <LeaveCard leaveData={leave} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}
