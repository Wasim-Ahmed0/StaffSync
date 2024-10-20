import Layout from "@/components/layout";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import "../styles/globals.css";
import Head from "next/head";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

const App = ({ Component, pageProps, ...appProps }: AppProps) => {
  TimeAgo.addLocale(en);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>
      <SessionProvider session={pageProps.session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </>
  );
};

export default App;
