import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import axios from "axios";

function AddData({ showAdd, setShowAdd }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    let token = window.sessionStorage.getItem("token");
    console.log("token " + token);
    axios
      .post(
        "https://r18tprb3-8000.asse.devtunnels.ms/admin",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
          body: {
            email: "",
          },
        },
        {}
      )
      .then((res) => {
        setDataAdmin(res.data);
      });
  }, []);

  return (
    <>
      <div className={`${showAdd ? `` : `d-none`} bg-opacity-50 mw-100`}>
        <form className="flex p-4 shadow-sm p-5">
          <div class="form-group">
            <label for="exampleInputName">Nama Admin</label>
            <input
              type="name"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter email"
            />
          </div>
          <div class="form-group mt-2">
            <label for="exampleInputEmail">Email Admin</label>
            <input
              type="email"
              class="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              placeholder="Enter email"
            />
          </div>
          <div class="form-group mt-2">
            <label for="exampleInputPassword">Password</label>
            <input
              type="password"
              class="form-control"
              id="exampleInputPassword1"
              placeholder="Password"
            />
          </div>
          <button type="submit" class="btn btn-primary mt-4">
            Submit
          </button>
        </form>
      </div>
    </>
  );
}

export default AddData;
