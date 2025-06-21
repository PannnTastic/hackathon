import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

const FaceMatch = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [nama, setNama] = useState('')
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/model/ssd_mobilenetv1_model-weights_manifest.json");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/model/face_landmark_68_model-weights_manifest.json");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/model/face_recognition_model-weights_manifest.json");
        setIsModelLoaded(true);
    };
    loadModels();
  }, []);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
    });
  }, []);

  console.log(isModelLoaded)

  setInterval(async () => {

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const detection = await faceapi
      .detectSingleFace(canvas)
      .withFaceLandmarks()
      .withFaceDescriptor();

    const descriptor = Array.from(detection.descriptor);

    const response = await fetch('http://localhost:5000/compare', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ foto: descriptor }),
    });

    const result = await response.json();
    setNama(result.nama ? result.nama : "Wajah tidak dikenali.");
  }, 1000);

  return (
    <div>
      <h2>Deteksi Kemiripan Wajah</h2>
      <video ref={videoRef} autoPlay muted style={{ width: '100%', maxWidth: 480 }} />
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <div>Terdeteksi sebagai : {nama}</div>
    </div>
  );
};

export default FaceMatch;
