import { useState } from "react";
import { Document } from "@prisma/client";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import prisma from "@/lib/prisma";
import { Icon } from "@iconify/react";
import Button from "@/components/Button";
import Head from "next/head";
import { motion } from "framer-motion";

type Props = {
  documents: Document[];
};

export default function Documents({ documents }: Props) {
  const [documentList, setDocumentList] = useState(documents);

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
        <title>StaffSync - Documents</title>
      </Head>
      <div className="flex grow flex-col gap-3">
        <h1 className="text-4xl font-semibold">Documents</h1>
        {documentList.length == 0 ? (
          <div className="flex grow flex-col items-center justify-center gap-2 text-center text-neutral-400">
            <Icon icon="ph:file-text-light" width="8em" />
            <h1 className="text-2xl font-semibold">No documents</h1>
            <p className="text-neutral-500">
              Check back later to see if any have been uploaded.
            </p>
          </div>
        ) : (
          <motion.div
            className="flex flex-col gap-2"
            initial="hidden"
            animate="visible"
            variants={list}
          >
            {documentList.map((document) => (
              <motion.div
                key={document.id}
                className="document flex flex-row items-center justify-between gap-4 rounded-2xl bg-white bg-opacity-80 p-3 text-black"
                variants={item}
              >
                <div>
                  <h1 className="text-xl font-semibold">{document.filename}</h1>
                  {document.dateCreated.toLocaleString()}
                </div>
                <div>
                  <a href={`/api/documents/retrieve?id=${document.id}`}>
                    <Button>Download</Button>
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    const documents = await prisma.document.findMany({
      where: {
        userUsername: session.user.username,
      },
      select: {
        id: true,
        filename: true,
        userUsername: true,
        dateCreated: true,
      },
    });

    return { props: { documents } };
  } else {
    return { props: {} };
  }
};
