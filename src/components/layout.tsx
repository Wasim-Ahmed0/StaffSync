import { useSession } from "next-auth/react";
import SignIn from "@/components/signin";
import { Inter } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import Navigation from "../components/Navigation";
import backgroundImage from "../../public/bg.jpg";
import { Icon } from "@iconify/react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();

  return (
    <div
      className={`${inter.className} min-h-dvh text-black antialiased`}
      style={{
        background: `linear-gradient(rgba(30, 30, 30, 0.85), rgba(30, 30, 30, 0.85)), url(${backgroundImage.src}) center / cover no-repeat fixed`,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={session.status}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        >
          {session.status == "loading" ? (
            <div className="flex min-h-dvh items-center justify-center gap-2 bg-neutral-800 text-xl font-medium text-white">
              <Icon icon="svg-spinners:90-ring-with-bg" />
              <p>Loading...</p>
            </div>
          ) : session.status == "authenticated" ? (
            <div className="min-h-dvh bg-neutral-900 bg-opacity-85">
              <Navigation></Navigation>
              <div className="text-white md:ml-60">
                <AnimatePresence
                  mode="wait"
                  onExitComplete={() => window.scrollTo(0, 0)}
                >
                  <motion.div
                    key={router.route}
                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                    transition={{ ease: "easeOut", duration: 0.2 }}
                  >
                    <main className="m-auto flex min-h-dvh max-w-[1000px] flex-col p-5 drop-shadow max-md:pt-20 md:pt-10">
                      {children}
                    </main>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <SignIn />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
