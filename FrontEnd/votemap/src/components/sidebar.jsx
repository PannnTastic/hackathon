import { useEffect, useState } from "react";
import "../App.css";

function Sidebar({ setIndex, role }) {
  const [clicked, setClicked] = useState(null);

  useEffect(() => {
    if (role == "province") {
      setClicked(1);
    } else if (role == "city") {
      setClicked(2);
    } else if (role == "district") {
      setClicked(3);
    } else if (role == "sub_district") {
      setClicked(3);
    }
  }, []);

  const menuItems = [
    "Manajemen Akun Admin Provinsi",
    "Manajemen Akun Admin Kabupaten",
    "Manajemen Akun Admin Kecamatan",
    "Manajemen Akun Admin Kelurahan",
    "Manajemen Akun Petugas",
    "Manajemen Data TPS",
    "Rekapitulasi Suara Masuk",
  ];

  const handleClick = (index) => {
    if (clicked !== index) {
      setClicked(index);
      setIndex(index);
    }
  };

  return (
    <div className="sidebar" style={{ width: "20vw" }}>
      <ul className="sidebar-menu">
        {menuItems.map((item, index) => {
          if (role === "national") {
            return (
              <li
                className={`sidebar-item ${clicked === index ? "active" : ""}`}
                key={index}
                onClick={() => handleClick(index)}
              >
                {item}
              </li>
            );
          } else if (role === "province" && index > 0) {
            return (
              <li
                className={`sidebar-item ${clicked === index ? "active" : ""}`}
                key={index}
                onClick={() => handleClick(index)}
              >
                {item}
              </li>
            );
          } else if (role === "city" && index > 1) {
            return (
              <li
                className={`sidebar-item ${clicked === index ? "active" : ""}`}
                key={index}
                onClick={() => handleClick(index)}
              >
                {item}
              </li>
            );
          } else if (role === "district" && index > 2) {
            return (
              <li
                className={`sidebar-item ${clicked === index ? "active" : ""}`}
                key={index}
                onClick={() => handleClick(index)}
              >
                {item}
              </li>
            );
          } else if (role === "subDistrict" && index > 3) {
            return (
              <li
                className={`sidebar-item ${clicked === index ? "active" : ""}`}
                key={index}
                onClick={() => handleClick(index)}
              >
                {item}
              </li>
            );
          }
          return null;
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
