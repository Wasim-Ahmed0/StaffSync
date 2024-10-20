import BackButton from "@/components/BackButton";
import Head from "next/head";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>StaffSync - Not found</title>
      </Head>
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-bold">404 - Page not found</h1>
        <BackButton />
      </div>
    </>
  );
}
