import { Icon } from "@iconify/react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "react-responsive";
import { useState } from "react";
import NavItem from "./NavItem";
import Link from "next/link";
import Image from "next/image";
import fdmLogo from "../../public/fdm.svg";
import fdmLogoDark from "../../public/fdm-dark.svg";

export default function Navigation({ ...attributes }) {
  const session = useSession();
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [navbar, setNavbar] = useState(false);

  const navItems = [
    {
      category: "",
      items: [
        {
          url: "/",
          title: "Home",
          icon: "ph:house",
        },
        {
          url: "/announcements",
          title: "Announcements",
          icon: "ph:megaphone",
        },
        {
          url: "/leave",
          title: "Leave",
          icon: "ph:airplane-takeoff",
        },
        {
          url: "/documents",
          title: "Documents",
          icon: "ph:file-text",
        },
        {
          url: "/help",
          title: "Help",
          icon: "ph:chats-circle",
        },
      ],
    },
  ];

  if (session.data && session.data.user) {
    if (
      session.data.user.role == "HR" ||
      session.data.user.role == "TECHNICIAN"
    ) {
      navItems.push({
        category: "Admins",
        items: [
          {
            url: "/manage/users",
            title: "Manage Users",
            icon: "ph:address-book",
          },
          {
            url: "/manage/tickets",
            title: "Manage Tickets",
            icon: "ph:ticket",
          },
        ],
      });
    }

    if (session.data.user.role == "HR") {
      navItems.push({
        category: "HR Employees",
        items: [
          {
            url: "/manage/leave",
            title: "Manage Leave",
            icon: "ph:calendar-check",
          },
          {
            url: "/manage/documents",
            title: "Manage Documents",
            icon: "ph:files",
          },
        ],
      });
    }
  }

  return (
    <AnimatePresence mode="wait">
      {session.data && session.data.user && !(isMobile && !navbar) && (
        <>
          {isMobile && ( // navigation background on mobile
            <motion.div
              className="fixed z-10 h-screen w-screen bg-neutral-950 bg-opacity-90 backdrop-blur-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNavbar(false)}
            ></motion.div>
          )}

          <motion.nav
            key="navbar"
            initial={{ opacity: 0, x: -150, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -150, filter: "blur(10px)" }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
            className="fixed z-20 h-dvh w-60 py-5 shadow-2xl"
          >
            <div className="flex h-full flex-col overflow-y-auto drop-shadow-[0_0px_10px_rgba(0,0,0,0.25)]">
              <header className="flex flex-row items-center justify-center gap-2 rounded-se-2xl bg-neutral-800 p-5 text-white">
                <Image src={fdmLogo} alt="FDM" className="mb-0.5 w-16" />
                <h1 className="flex items-center justify-center gap-1 text-2xl font-bold">
                  StaffSync
                </h1>
              </header>
              <div className="flex h-full flex-col gap-1 rounded-ee-3xl bg-white bg-opacity-70 p-3">
                {navItems.map(({ category, items }) => {
                  var navbarContent = [
                    <li
                      key={category}
                      className={`list-none ${category !== "" ? "mt-4" : ""} mx-1 text-sm uppercase text-neutral-800`}
                    >
                      {category}
                    </li>,
                  ];

                  return navbarContent.concat(
                    items.map(({ url, title, icon }) => (
                      <li
                        key={url}
                        className="list-none"
                        onClick={() => setNavbar(false)}
                      >
                        <NavItem url={url} title={title} icon={icon}></NavItem>
                      </li>
                    )),
                  );
                })}
                <div className="mt-auto">
                  <li className="list-none" onClick={() => setNavbar(false)}>
                    <NavItem
                      url="/settings"
                      title={`${session.data.user.firstName} ${session.data.user.lastName}`}
                      icon="ph:user"
                    ></NavItem>
                  </li>
                </div>
              </div>
            </div>
          </motion.nav>
        </>
      )}
      {isMobile && !navbar && (
        <motion.div
          key="menubar"
          initial={{ opacity: 0, y: -30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
          transition={{ ease: "easeInOut", duration: 0.2 }}
          className="fixed z-10 flex w-screen items-center justify-between gap-1 rounded-b-xl bg-white bg-opacity-70 p-3 text-2xl drop-shadow-lg backdrop-blur-lg"
        >
          <button onClick={() => setNavbar(true)}>
            <Icon icon="ph:list"></Icon>
          </button>
          <Link
            scroll={false}
            href="/"
            className="flex items-center gap-2 font-semibold"
          >
            <Image src={fdmLogoDark} alt="FDM" className="mt-[1px] w-14" />
            StaffSync
          </Link>
          <Link scroll={false} href="/settings">
            <Icon icon="ph:user"></Icon>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
