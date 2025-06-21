import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";
import FormIndex from "../formsManagement/formIndex";

function AdminKecamatan({ jwt }) {
  const [index, setIndex] = useState(2);
  const navigate = useNavigate();

  function setIndexes(indexes) {
    setIndex(indexes);
  }

  useEffect(() => {
    if (jwt !== "district") {
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

export default AdminKecamatan;
