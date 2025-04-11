import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Toaster } from "sonner"; // 👈 Importa o Toaster

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>EcoPulse</title>
        <link rel="icon" type="image/png" href="/logo_biodata.png" />
      </Head>

      {/* Toaster para notificações visuais */}
      <Toaster richColors position="top-center" />

      <Component {...pageProps} />
    </>
  );
}
