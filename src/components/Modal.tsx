import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import Modal from "react-modal";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  title: string;
  closeButton?: boolean;
  children: React.ReactNode;
};

export default function ModalPopup({
  visible,
  setVisible,
  title,
  closeButton = true,
  children,
}: Props) {
  const router = useRouter();

  const customStyles = {
    overlay: {
      zIndex: 100,
      background: "none",
    },
    content: {
      background: "none",
      border: "none",
      padding: "0",
      inset: "0",
    },
  };

  return (
    <Modal isOpen={visible} style={customStyles}>
      <motion.div
        className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-neutral-950 bg-opacity-60 p-8 backdrop-blur-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: "easeInOut", duration: 0.3 }}
      >
        <motion.div
          className="flex max-w-2xl flex-col gap-3 rounded-2xl bg-white bg-opacity-90 p-5 shadow"
          initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 50, filter: "blur(10px)" }}
          transition={{
            ease: "easeInOut",
            duration: 0.4,
            type: "spring",
            bounce: 0.3,
          }}
        >
          <div className="flex items-start justify-between gap-3 text-2xl">
            <h1 className="font-semibold">{title}</h1>
            {closeButton && (
              <Icon
                icon="ph:x-bold"
                onClick={() => setVisible(false)}
                className="rounded-md transition-colors hover:bg-red-200 active:bg-red-300"
              />
            )}
          </div>
          <div>{children}</div>
        </motion.div>
      </motion.div>
    </Modal>
  );
}
