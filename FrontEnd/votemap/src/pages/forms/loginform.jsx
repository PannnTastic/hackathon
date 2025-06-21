import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

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
        display: "inline-block",
        backgroundColor: "white",
        padding: "30px",
        paddingBottom: "70px",
        borderRadius: "10px",
      }}
    >
      <h4 className="mb-3">Login Ke Akun Anda</h4>
      <div>
        <div className="mb-2">
          <label htmlFor="exampleInputEmail1" className="form-label mb-1">
            Username
          </label>
          <input
            type="text"
            className="form-control mr-2"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            required
            style={{
              width: "320px",
              backgroundColor: "#F1EFEF",
              border: "1px solid #CBCBCB",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label mb-1">
            Password
          </label>
          <input
            type="password"
            className="form-control mr-2"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            required
            style={{
              width: "320px",
              backgroundColor: "#F1EFEF",
              border: "1px solid #CBCBCB",
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <button
            style={{
              color: "white",
              backgroundColor: "#E30505",
              border: "1px solid #890000",
              borderRadius: "5px",
              width: "320px",
              height: "37px",
              fontSize: "12px",
            }}
            className="istok-web-bold align-self-end"
            onClick={async () => {
              let token = await getAuth();
              if (token != "Login Invalid") {
              }
              let decode = jwtDecode(token);
              getRole(decode.role);
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default FormLogin;
