import { Link } from "react-router-dom";
import PageAddAdminProv from "../forms/formprov";

function FormLink({ index }) {
  const routesForm = [
    "/form/provinsi",
    "form/kabupaten",
    "form/kecamatan",
    "form/kelurahan",
  ];

  return <>{index !== null && <Link to={routesForm[index]} />}</>;
}

export default FormLink;
