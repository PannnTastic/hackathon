// components/FaceCapture.js
import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceCapture = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  // Load model saat komponen pertama kali dimount
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/model/ssd_mobilenetv1_model-weights_manifest.json");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/model/face_landmark_68_model-weights_manifest.json");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/model/face_recognition_model-weights_manifest.json");
      setIsModelLoaded(true);
    };
    loadModels();
  }, []);

  console.log(isModelLoaded)

  // Akses webcam
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  // Tangkap gambar dan deteksi wajah
  const handleCapture = async () => {
    if (!isModelLoaded) return alert("Model belum siap");

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const detections = await faceapi
      .detectSingleFace(canvas)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections) {
      alert("Wajah tidak terdeteksi. Pastikan wajah terlihat jelas.");
      return;
    }

    const foto = Array.from(detections.descriptor); // Ubah ke array biasa

    const nama = prompt("Masukkan nama untuk didaftarkan:");
    if (nama) {
      // Kirim ke backend
      await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, foto }),
      });
      alert("Wajah berhasil direkam.");
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay muted style={{ width: '100%', maxWidth: 480 }} />
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <button onClick={handleCapture}>Ambil Gambar & Daftarkan</button>
    </div>
  );
};

export default FaceCapture;
