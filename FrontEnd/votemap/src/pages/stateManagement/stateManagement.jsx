import { useEffect, useState } from "react"
import StateRoute from "./StateRoute"
import { BrowserRouter as Router } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

function StateManagement() {
    const [roles, setRoles] = useState(null) // null artinya belum tahu

    useEffect(() => {
        const token = window.sessionStorage.getItem("token")
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