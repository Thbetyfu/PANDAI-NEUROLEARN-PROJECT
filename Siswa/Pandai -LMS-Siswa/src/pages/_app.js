import "@/styles/globals.css";
import GlobalIntervention from '@/components/_shared/GlobalIntervention';

export default function App({ Component, pageProps }) {
  return (
    <GlobalIntervention>
      <Component {...pageProps} />
    </GlobalIntervention>
  );
}
