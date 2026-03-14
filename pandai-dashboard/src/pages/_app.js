import "@/styles/globals.css";
import { useSimulation } from "@/hooks/useSimulation";
import IntegrityGuard from "@/components/Common/IntegrityGuard";

export default function App({ Component, pageProps }) {
  // useSimulation(); // Matikan simulasi agar menggunakan data real MQTT
  return (
    <IntegrityGuard>
      <Component {...pageProps} />
    </IntegrityGuard>
  );
}
