import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axiosClient from "../services/axios-client";
import { useEffect, useState } from "react";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";

export default function DefaultLayout() {
    const { user, token, role, setUser, setToken, setRole } = useAuth();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const onLogout = (ev) => {
        ev.preventDefault();

        axiosClient.post('/logout')
            .then(() => {
                setUser({});
                setToken(null);
                setRole(null);
            })
            .catch(() => {
                setUser({});
                setToken(null);
                setRole(null);
            })
    }


    useEffect(() => {
        axiosClient.get('/user')
            .then(({ data }) => {
                setUser(data);
                setRole(data.role); // Ensure role is synced
            })
    }, [])

    if (!token) {
        return <Navigate to="/login" />
    }

    return (
        <div id="defaultLayout" className={sidebarCollapsed ? 'sidebar-collapsed' : ''}>
            <Sidebar />
            {sidebarCollapsed && (
                <div
                    onClick={() => setSidebarCollapsed(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 90,
                        display: window.innerWidth <= 768 ? 'block' : 'none'
                    }}
                />
            )}
            <div className="content">
                <Header
                    sidebarCollapsed={sidebarCollapsed}
                    setSidebarCollapsed={setSidebarCollapsed}
                    onLogout={onLogout}
                />
                <main>
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
