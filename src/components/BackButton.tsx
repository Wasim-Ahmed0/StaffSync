import { Icon } from "@iconify/react";
import { useRouter } from "next/router";

function BackButton() {
  const router = useRouter();
  return (
    //button will only show on pages that arent / as will be given hidden class
    <button
      onClick={() => router.back()}
      className="flex flex-row items-center gap-1 font-medium transition hover:opacity-80 active:opacity-60"
    >
      <Icon icon="ph:arrow-left-bold"></Icon> Back
    </button>
  );
}

export default BackButton;
