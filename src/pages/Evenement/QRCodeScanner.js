import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
import axios from 'axios';

const QRCodeScanner = () => {
  const [scanResult, setScanResult] = useState('');

  const handleScan = async (data) => {
    if (data) {
      setScanResult(data);
      const urlParams = new URLSearchParams(new URL(data).search);
      const eventId = urlParams.get('eventId');
      const userId = urlParams.get('userId');

      try {
        const response = await axios.get(`http://localhost:8081/api/participations/validate-qr-code?eventId=${eventId}&userId=${userId}`);
        alert(response.data.message);
      } catch (error) {
        alert('Error validating QR code: ' + error.response.data.message);
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div>
      <h1>QR Code Scanner</h1>
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />
      <p>{scanResult}</p>
    </div>
  );
};

export default QRCodeScanner;
