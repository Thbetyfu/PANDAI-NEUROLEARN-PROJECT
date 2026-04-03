import { useState, useEffect } from 'react';
import mqtt from 'mqtt';

export const useHistoryMqtt = () => {
  // State penampung data dari Python
  const [historyData, setHistoryData] = useState([]);
  
  // State untuk animasi loading di UI (Sangat penting untuk UX)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Keamanan QA: Mencegah Memory Leak di React
    
    // Koneksi ke EMQX Cloud via WebSockets Secure (WSS)
    const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt');

    client.on('connect', () => {
      if (isMounted) {
        console.log('[LMS-History] 🌐 Terhubung ke Cloud, meminta data riwayat...');
        
        // 1. [V25.5.2] Subscribe (dengarkan) balasan spesifik dari PANDAI_NC_01
        client.subscribe('pandai/v1/PANDAI_NC_01/history/response');
        
        // 2. [V25.5.2] Publish (kirim permintaan) ke PANDAI_NC_01
        client.publish('pandai/v1/PANDAI_NC_01/history/request', 'GET_7_DAYS');
      }
    });

    client.on('message', (topic, message) => {
      if (topic === 'pandai/v1/PANDAI_NC_01/history/response' && isMounted) {
        try {
          // Mengubah string JSON dari Python menjadi Array Object React
          const parsedData = JSON.parse(message.toString());
          // Handling dynamic response format (wrap to .data if exists)
          const finalData = Array.isArray(parsedData) ? parsedData : (parsedData.data || []);
          setHistoryData(finalData);
          setIsLoading(false); // Matikan loading saat data tiba
          
          console.log('[LMS-History] 📥 Data riwayat berhasil diterima:', finalData);
        } catch (err) {
          console.error('[LMS-History] ⚠️ Gagal memparsing data JSON:', err);
          setError('Gagal membaca data riwayat dari alat.');
          setIsLoading(false);
        }
      }
    });

    client.on('error', (err) => {
      if (isMounted) {
        console.error('[LMS-History] ❌ Koneksi MQTT Error:', err);
        setError('Koneksi terputus ke Cloud.');
        setIsLoading(false);
      }
    });

    // Cleanup saat user pindah halaman
    return () => {
      isMounted = false;
      client.end();
    };
  }, []);

  return { historyData, isLoading, error };
};
