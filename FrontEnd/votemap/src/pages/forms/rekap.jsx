import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Maps from "../../components/maps";
import Filter from "../../components/pilihan";

function FormLogin({ getRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function getAuth() {
    return axios
      .post("https://r18tprb3-8000.asse.devtunnels.ms/auth/login", {
        email: email,
        password: password,
      })
      .then((res) => {
        console.log(res);
        window.sessionStorage.setItem("token", res.data.token);
        return res.data.token;
      });
  }

  return (
    <div
      style={{
        width: "100%",
        display: "inline-block",
        backgroundColor: "white",
        padding: "30px",
        paddingBottom: "70px",
        borderRadius: "10px",
      }}
    >
      <h4 className="mb-3 w-100 text-center">Rekapitulasi Suara Masuk</h4>
      <Filter />
      <Maps />
    </div>
  );
}

export default FormLogin;
