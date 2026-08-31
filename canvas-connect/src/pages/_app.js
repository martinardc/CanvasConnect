// pages/_app.js
import Head from "next/head";
import "../styles/global.css";
import "react-chat-elements/dist/main.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>CanvasConnect</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="preconnect" href="https://fonts.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
      </Head>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;
