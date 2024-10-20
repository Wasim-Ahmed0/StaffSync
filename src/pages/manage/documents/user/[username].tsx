import Head from "next/head";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../api/auth/[...nextauth]";
import { User } from "@prisma/client";
import prisma from "@/lib/prisma";
import { Document } from "@prisma/client";
import { useState } from "react";
import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

type Props = {
  user: User;
  documents: Document[];
};

export default function UserDocuments({ user, documents }: Props) {
  const [documentList, setDocumentList] = useState<Document[]>(documents);
  const [file, setFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (!file) {
        setUploadError("Please select a file to upload.");
        return;
      }

      if (file.size > 52428800) {
        setUploadError("File is too big. Size limit is 50MB");
        return;
      }

      const formData = new FormData();
      formData.append("username", user.username);
      formData.append("file", file);

      try {
        const response = await fetch("/api/documents/uploadByUsername", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          setFile(null);
          setUploadError(null);

          const newDocument = await response.json();
          setDocumentList((prevDocuments) => [...prevDocuments, newDocument]);
        } else {
          throw new Error("Failed to upload document");
        }
      } catch (error) {
        console.error("Error uploading document:", error);
        setUploadError("Failed to upload document. Please try again.");
      }
    }
  };

  const handleDownload = async (document: Document) => {
    window.open(`/api/documents/retrieve?id=${document.id}`, "_blank");
  };

  const handleDelete = async (document: Document) => {
    try {
      const response = await fetch(`/api/documents/delete?id=${document.id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setDocumentList(documentList.filter((doc) => doc.id !== document.id));
      } else {
        console.error("Failed to delete document");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

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
        <title>
          StaffSync - Documents for {user.firstName} {user.lastName}
        </title>
      </Head>
      <div className="flex grow flex-col gap-3">
        <BackButton />
        <div className="flex flex-row justify-between">
          <h1 className="text-4xl font-semibold">
            Documents for {user.firstName} {user.lastName}
          </h1>
          <div>
            <label className="flex cursor-pointer items-center justify-center gap-1 text-nowrap rounded-full bg-primary px-3 py-2 font-medium text-black shadow-lg transition hover:bg-white active:bg-white active:bg-opacity-70">
              <input
                className="hidden"
                type="file"
                onChange={handleFileUpload}
              />
              Upload
            </label>
            {uploadError && <p className="text-red-500">{uploadError}</p>}
          </div>
        </div>
        {documentList.length == 0 ? (
          <div className="flex grow flex-col items-center justify-center gap-2 text-center text-neutral-400">
            <Icon icon="ph:file-text-light" width="8em" />
            <h1 className="text-2xl font-semibold">No documents</h1>
            <p className="text-neutral-500">
              Click &apos;Upload&apos; in the top right to upload one.
            </p>
          </div>
        ) : (
          <motion.ul initial="hidden" animate="visible" variants={list}>
            {documentList.map((document) => (
              <motion.li
                className="mb-2 flex flex-row items-center justify-between rounded-2xl bg-white bg-opacity-80 p-3 text-black"
                key={document.id}
                variants={item}
              >
                <div>
                  <h1 className="text-xl font-semibold">{document.filename}</h1>
                  {new Date(document.dateCreated).toLocaleString()}
                </div>
                <div className="flex flex-row gap-1 max-md:flex-col">
                  <Button onClick={() => handleDownload(document)}>
                    Download
                  </Button>
                  <Button onClick={() => handleDelete(document)}>Delete</Button>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { props: {} };
  }

  try {
    const username = context.params?.username as string;

    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    const documents = await prisma.document.findMany({
      where: {
        userUsername: username,
      },
      select: {
        id: true,
        filename: true,
        userUsername: true,
        dateCreated: true,
      },
    });

    return {
      props: {
        user,
        documents,
      },
    };
  } catch (error) {
    console.error("Error fetching user details:", error);
    return { props: { error: "Failed to fetch user details" } };
  }
};
