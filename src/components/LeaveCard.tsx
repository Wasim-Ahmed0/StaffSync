import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { LeaveRequest } from "@prisma/client";

type Props = {
  leaveData: LeaveRequest;
};

const LeaveCard = ({ leaveData }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(!expanded);
  };

  const formatDate = (dateString: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-UK", options).format(
      new Date(dateString),
    );
  };

  const calculateDuration = (startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const durationInMilliseconds = end.getTime() - start.getTime();
    const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);
    return Math.round(durationInDays); // Round the result to avoid decimal values
  };

  const duration = calculateDuration(leaveData.startDate, leaveData.endDate);

  return (
    <div
      className="flex cursor-pointer flex-col items-start justify-between gap-3 rounded-2xl bg-white bg-opacity-80 p-3 text-black"
      onClick={handleClick}
    >
      <div className="flex w-full items-center justify-between">
        <div className="grid w-full grid-cols-3 items-center">
          <div className="flex flex-col">
            <span className="text-lg">{formatDate(leaveData.startDate)}</span>
            <span className="font-bold">{leaveData.reason}</span>
          </div>

          <div>
            <span className="flex flex-col items-center text-2xl font-bold">
              {duration} {duration == 1 ? "day" : "days"}
            </span>
          </div>

          <span
            className={`text-md flex flex-col items-center ${getStatusColor(leaveData.requestStatus)}`}
          >
            {leaveData.requestStatus}
          </span>
        </div>

        <button
          onClick={handleClick}
          className="flex items-center text-left font-semibold"
        >
          {expanded ? (
            <Icon className="mt-1" icon="ph:caret-up-bold" />
          ) : (
            <Icon className="mt-1" icon="ph:caret-down-bold" />
          )}
        </button>
      </div>

      {expanded && (
        <div className="mt-2 w-full border-t border-black text-sm">
          <p className="my-5 text-lg font-bold">Leave Request Details:</p>
          <p>Start Date: {formatDate(leaveData.startDate)}</p>
          <p>End Date: {formatDate(leaveData.endDate)}</p>
          <p>
            Duration:{" "}
            {calculateDuration(leaveData.startDate, leaveData.endDate)} days
          </p>
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status: string) => {
  if (status === "Accepted") {
    return "text-green-600";
  } else if (status === "Pending") {
    return "text-yellow-600";
  } else {
    return "text-red-600";
  }
};

export default LeaveCard;
