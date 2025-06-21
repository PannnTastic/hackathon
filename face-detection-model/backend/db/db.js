const mysql = require('mysql')

const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    database : "face-recognition",
    password : ''
})

db.connect((err) => {
    if (err) {
        console.log("Gagal konek ke database");
    } else {
        console.log("DB Connect")
    }
})

module.exports = db;