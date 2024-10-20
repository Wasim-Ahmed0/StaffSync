import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ManageLeaveCards from "@/components/ManageLeaveCards";
import { useRouter } from "next/router";
import { LeaveRequest } from "@prisma/client";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import Head from "next/head";
import Button from "@/components/Button";
import Modal from "@/components/Modal";

const LeaveManagementPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [filter, setFilter] = useState("pending");

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(<></>);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "HR") {
      router.push("/leave");
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchAllLeaveRequests = async () => {
      try {
        const response = await fetch(`/api/leaveRequests`);
        if (!response.ok) {
          throw new Error("Failed to fetch leave requests");
        }
        let data = await response.json();

        if (session?.user?.username) {
          data = data.filter(
            (request: LeaveRequest) =>
              request.userUsername !== session.user?.username,
          );
        }

        const sortedData = data.sort((a: any, b: any) => {
          const statusPriority: { [key: string]: number } = {
            Pending: 1,
            Accepted: 2,
            Declined: 3,
          };

          const priorityA = statusPriority[a.status] || 99;
          const priorityB = statusPriority[b.status] || 99;

          if (priorityA < priorityB) return -1;
          if (priorityA > priorityB) return 1;

          const dateA = new Date(a.startDate);
          const dateB = new Date(b.startDate);
          return dateA.getTime() - dateB.getTime();
        });

        setLeaveRequests(sortedData);
      } catch (error) {
        console.error("Error fetching leave requests:", error);
      }
    };

    fetchAllLeaveRequests();
  }, [session]);

  const handleStatusUpdate = async (id: any, newStatus: string) => {
    try {
      const response = await fetch(
        `/api/leaveRequests/updateleavestatus?id=${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ requestStatus: newStatus }),
        },
      );
      if (!response.ok) {
        throw new Error("Failed to update leave request status");
      }

      const updatedLeaveRequests = leaveRequests.map((request) => {
        if (request.id === id) {
          return { ...request, requestStatus: newStatus };
        }
        return request;
      });

      setLeaveRequests(updatedLeaveRequests);

      setMessage(
        <div className="flex flex-col gap-3">
          <p>Leave request has been {newStatus.toLowerCase()} successfully.</p>
          <Button onClick={() => setVisible(false)}>OK</Button>
        </div>,
      );
      setVisible(true);
    } catch (error) {
      console.error("Error updating leave request status:", error);
      alert("Failed to update leave request status. Please try again.");
    }
  };

  const filteredRequests =
    filter == "all"
      ? leaveRequests
      : filter == "pending"
        ? leaveRequests.filter(
            (request: LeaveRequest) => request.requestStatus === "Pending",
          )
        : leaveRequests.filter(
            (request: LeaveRequest) =>
              request.requestStatus === "Accepted" ||
              request.requestStatus === "Declined",
          );

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
        <title>StaffSync - Manage Leave</title>
      </Head>
      <div className="flex grow flex-col gap-5">
        <div className="flex justify-between gap-3 max-md:flex-col">
          <h1 className="text-4xl font-semibold">Manage Leave</h1>
          <select
            className="flex items-center justify-center gap-1 rounded-full bg-gray-200 px-3 py-2 font-medium text-black shadow-lg transition hover:bg-opacity-90 active:bg-white active:bg-opacity-70"
            defaultValue="pending"
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending Requests</option>
            <option value="responded">Responded Requests</option>
          </select>
        </div>
        {leaveRequests.length == 0 ? (
          <div className="flex grow flex-col items-center justify-center gap-2 text-center text-neutral-400">
            <Icon icon="ph:airplane-takeoff-light" width="8em" />
            <h1 className="text-2xl font-semibold">No leave requests</h1>
          </div>
        ) : filteredRequests.length == 0 ? (
          <div className="flex grow flex-col items-center justify-center gap-2 text-center text-neutral-400">
            <Icon icon="ph:funnel-light" width="8em" />
            <h1 className="text-2xl font-semibold">
              No requests matching filter
            </h1>
            <p className="text-neutral-500">
              Try selecting a different filter in the top right.
            </p>
          </div>
        ) : (
          <motion.div
            className="flex flex-col gap-2"
            initial="hidden"
            animate="visible"
            variants={list}
          >
            {filteredRequests.map((request) => (
              <motion.div key={request.id} variants={item}>
                <ManageLeaveCards
                  leaveData={request}
                  onAccept={(id: any) => handleStatusUpdate(id, "Accepted")}
                  onDecline={(id: any) => handleStatusUpdate(id, "Declined")}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <Modal
        visible={visible}
        setVisible={setVisible}
        title="Leave request updated"
      >
        {message}
      </Modal>
    </>
  );
};

export default LeaveManagementPage;
