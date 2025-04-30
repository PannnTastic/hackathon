import { useEffect, useState } from "react"
import StateRoute from "./StateRoute"
import { BrowserRouter as Router } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

function StateManagement() {
    const [roles, setRoles] = useState(null) // null artinya belum tahu

    useEffect(() => {
        const token = getCookieValue('token')
        if (token) {
            try {
                const decoded = jwtDecode(token)
                setRoles(decoded.role)
            } catch (error) {
                console.error("Token invalid:", error)
                setRoles('')
            }
        } else {
            setRoles('')
        }
    }, [])

    function getCookieValue(name) {
        const value = document.cookie
            .split("; ")
            .find(row => row.startsWith(name + "="));
        return value ? value.split("=")[1] : null;
    }

    function getRole(role) {
        setRoles(role)
    }

    return (
        <Router>
            {roles !== null ? (
                <StateRoute roles={roles} getRole={getRole} />
            ) : (
                <div>Loading authentication...</div>
            )}
        </Router>
    )
}

export default StateManagement