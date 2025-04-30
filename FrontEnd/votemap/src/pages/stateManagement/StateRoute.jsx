import {Routes, Route, Navigate, useLocation, useNavigate} from 'react-router-dom';
import Login from '../login';
import FormLogin from '../forms/loginform';
import AdminNasional from '../admin/nasional';
import AdminProvinsi from '../admin/provinsi';
import { useEffect } from 'react';

function StateRoute({ roles, getRole }) {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (!roles) return
        if (roles === "national" && location.pathname === '/login') navigate('/admin/nasional')
        else if (roles === "province" && location.pathname === '/login') navigate('/admin/provinsi')
    }, [roles])

    // Cegah redirect saat roles belum diketahui
    if (roles === null) return null

    return (
        <Routes>
            <Route path="/login" element={<Login elements={<FormLogin getRole={getRole}/> } />} />
            <Route path="/admin/nasional" element={<AdminNasional jwt={roles} />} />
            <Route path="/admin/provinsi" element={<AdminProvinsi jwt={roles} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}

export default StateRoute;