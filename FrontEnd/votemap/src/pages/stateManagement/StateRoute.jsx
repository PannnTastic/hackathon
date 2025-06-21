import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "../login";
import FormLogin from "../forms/loginform";
import AdminNasional from "../admin/nasional";
import AdminProvinsi from "../admin/provinsi";
import OfficerState from "../../../officer/officer";
import { useEffect } from "react";
import AdminKabupaten from "../admin/kabupaten";
import AdminKelurahan from "../admin/kelurahan";
import AdminKecamatan from "../admin/kecamatan";

function StateRoute({ roles, getRole }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!roles) return;
    if (roles === "national" && location.pathname === "/login")
      navigate("/admin/nasional");
    else if (roles === "province" && location.pathname === "/login")
      navigate("/admin/provinsi");
    else if (roles === "city" && location.pathname === "/login")
      navigate("/admin/kabupaten");
    else if (roles === "district" && location.pathname === "/login")
      navigate("/admin/kecamatan");
    else if (roles === "officerTps" && location.pathname === "/login")
      navigate("/officer");
  }, [roles]);

  // Cegah redirect saat roles belum diketahui
  if (roles === null) return null;

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login elements={<FormLogin getRole={getRole} />} />}
      />
      <Route path="/admin/nasional" element={<AdminNasional jwt={roles} />} />
      <Route path="/admin/provinsi" element={<AdminProvinsi jwt={roles} />} />
      <Route path="/admin/kabupaten" element={<AdminKabupaten jwt={roles} />} />
      <Route path="/admin/kecamatan" element={<AdminKecamatan jwt={roles} />} />
      <Route path="/admin/kelurahan" element={<AdminKelurahan jwt={roles} />} />
      <Route path="/officer" element={<OfficerState jwt={roles} />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default StateRoute;
