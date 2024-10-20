import { Icon } from "@iconify/react";

type Props = {
  status: string;
};

export default function TicketStatus({ status }: Props) {
  return (
    <p
      className={`flex items-center justify-center gap-1 rounded-full p-2 px-3 text-white transition duration-500 ${status == "Unresolved" ? "bg-red-500" : "bg-green-500"}`}
    >
      <Icon icon="ph:info-bold" />
      <b>Status: </b>
      {status}
    </p>
  );
}
