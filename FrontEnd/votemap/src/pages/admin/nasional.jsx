import { useEffect, useState } from "react";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import FormIndex from "../formsManagement/formIndex";
import { useNavigate } from "react-router-dom";

function AdminNasional({ jwt }) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  function setIndexes(indexes) {
    setIndex(indexes);
  }

  useEffect(() => {
    if (jwt !== "national") {
      navigate("/login");
    }
  }, [jwt, navigate]);

  return (
    <>
      <Navbar />
      <div
        style={{
          display: "flex",
        }}
      >
        <Sidebar setIndex={setIndexes} role={jwt} />
        <div style={{ width: "80vw" }}>
          <FormIndex index={index} />
        </div>
      </div>
    </>
  );
}

export default AdminNasional;
