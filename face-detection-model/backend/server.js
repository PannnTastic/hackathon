const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const faceapi = require("face-api.js");
const canvas = require("canvas");
const db = require("./db/db");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // sesuaikan dengan port React kamu
    credentials: true, // jika kamu pakai cookie atau auth
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/register", async (req, res) => {
  const { nama, foto } = req.body;

  // Validasi
  if (!nama || !foto) {
    return res.status(400).json({ message: "Nama dan descriptor wajib diisi" });
  }

  // Simpan ke database
  await db.query("INSERT INTO pemilih (nama, foto) VALUES (?, ?)", [
    nama,
    JSON.stringify(foto),
  ]);

  res.json({ success: true, message: "Data berhasil disimpan" });
});

app.post("/absen", async (req, res) => {
  const { currentDescriptor } = req.body;

  // Ambil semua pengguna dari database
  const rows = await db.query("SELECT * FROM pemilih");

  let recognizedUser = null;
  let minDistance = Infinity;

  for (const row of rows) {
    const storedDescriptor = JSON.parse(row.deskriptor);
    const distance = euclideanDistance(currentDescriptor, storedDescriptor);

    if (distance < 0.6 && distance < minDistance) {
      recognizedUser = row;
      minDistance = distance;
    }
  }

  if (recognizedUser) {
    res.json({
      success: true,
      nama: recognizedUser.nama,
      confidence: (1 - minDistance).toFixed(2),
    });
  } else {
    res.status(404).json({ success: false, message: "Wajah tidak dikenali" });
  }
});

app.post("/compare", async (req, res) => {
  const inputDescriptor = req.body.foto;

  try {
    db.query("SELECT nama, foto FROM pemilih", (err, result) => {
      if (result.length === 0) {
        return res
          .status(404)
          .json({ error: "Tidak ada data wajah di database." });
      }

      let minDistance = Infinity;
      let matchedName = null;

      // Bandingkan dengan setiap data wajah di database
      for (const row of result) {
        const savedDescriptor = JSON.parse(row.foto); // Parse string foto jadi array
        const distance = faceapi.euclideanDistance(
          inputDescriptor,
          savedDescriptor
        );

        if (distance < 0.5 && distance < minDistance) {
          minDistance = distance;
          matchedName = row.nama;
        }
      }

      // Kirimkan hasil perbandingan
      if (matchedName) {
        res.json({ nama: matchedName });
      } else {
        res
          .status(404)
          .json({ error: "Wajah tidak ditemukan dalam database." });
      }
    });
  } catch (err) {
    console.error(err);
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
