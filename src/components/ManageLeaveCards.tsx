import { LeaveRequest } from "@prisma/client";

const ManageLeaveCards: React.FC<{
  leaveData: LeaveRequest;
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
}> = ({ leaveData, onAccept, onDecline }) => {
  const formatDate = (dateString: any) => {
    const options: any = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Intl.DateTimeFormat("en-UK", options).format(
      new Date(dateString),
    );
  };

  const calculateDuration = (startDate: any, endDate: any) => {
    const start: any = new Date(startDate);
    const end: any = new Date(endDate);
    const durationInMilliseconds: number = end - start;
    const durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);
    return Math.round(durationInDays); // Round the result to avoid decimal values
  };

  return (
    <div className="flex flex-col items-start justify-between gap-3 rounded-2xl bg-white bg-opacity-80 p-3 text-black">
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col">
          <span className="text-lg">{formatDate(leaveData.startDate)}</span>
          <span className="font-bold">
            Requested by: {leaveData.userUsername}
          </span>
        </div>

        <span className={`text-md ${getStatusColor(leaveData.requestStatus)}`}>
          {leaveData.requestStatus}
        </span>
      </div>

      <div className="w-full">
        <p className="text-lg font-bold">Leave Request Details:</p>
        <p>Type: {leaveData.reason}</p>
        <p>Start Date: {formatDate(leaveData.startDate)}</p>
        <p>End Date: {formatDate(leaveData.endDate)}</p>
        <p>
          Duration: {calculateDuration(leaveData.startDate, leaveData.endDate)}{" "}
          days
        </p>
        <div className="flex justify-end gap-1">
          {leaveData.requestStatus !== "Accepted" &&
          leaveData.requestStatus !== "Declined" ? (
            <>
              <button
                onClick={() => onAccept(leaveData.id)}
                className="flex items-center justify-center gap-1 rounded-full bg-green-600 px-3 py-2 font-medium text-white shadow-lg transition hover:bg-white hover:text-black active:bg-white active:bg-opacity-70"
              >
                Accept
              </button>
              <button
                onClick={() => onDecline(leaveData.id)}
                className="flex items-center justify-center gap-1 rounded-full bg-red-600 px-3 py-2 font-medium text-white shadow-lg transition hover:bg-white hover:text-black active:bg-white active:bg-opacity-70"
              >
                Decline
              </button>
            </>
          ) : (
            <p className="text-gray-300">Already submitted</p>
          )}
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status: any) => {
  if (status === "Accepted") {
    return "text-green-600";
  } else if (status === "Pending") {
    return "text-yellow-600";
  } else {
    return "text-red-600";
  }
};

export default ManageLeaveCards;
