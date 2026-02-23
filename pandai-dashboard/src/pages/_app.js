import "@/styles/globals.css";
import { useSimulation } from "@/hooks/useSimulation";

export default function App({ Component, pageProps }) {
  useSimulation();
  return <Component {...pageProps} />;
}
