import { useEffect, useState } from "react";
import "../styles/admin.css";
import { useAuth } from "../context/AuthContext";
import { getAdminDashboard } from "../api/admin.api";

export default function AdminPage() {
    const { user } = useAuth();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await getAdminDashboard();
                setDashboard(res.data);
            } catch (e) {
                console.error("Load admin dashboard failed", e);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return <div style={{ padding: 24, fontWeight: 800 }}>Loading dashboard...</div>;
    }

    const stats = dashboard?.stats;

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <div className="admin-logo">MC</div>
                    <div>
                        <div className="admin-name">MediConnect</div>
                        <div className="admin-sub">Admin Dashboard</div>
                    </div>
                </div>

                <nav className="admin-menu">
                    <a className="admin-item active" href="/admin">
                        Dashboard
                    </a>
                    <a className="admin-item" href="#">
                        Doctors
                    </a>
                    <a className="admin-item" href="#">
                        Appointments
                    </a>
                    <a className="admin-item" href="#">
                        Users
                    </a>
                    <a className="admin-item" href="#">
                        Slots
                    </a>
                </nav>
            </aside>

            <main className="admin-main">
                <div className="admin-header">
                    <div>
                        <h2>Dashboard</h2>
                        <p>
                            Xin chào <b>{user?.name || "Admin"}</b>
                        </p>
                    </div>
                </div>

                <div className="admin-cards">
                    <div className="admin-card">
                        <div className="admin-card-title">Active Doctors</div>
                        <div className="admin-card-value">
                            {stats?.active_doctor_profiles ?? "--"}
                        </div>
                    </div>

                    <div className="admin-card">
                        <div className="admin-card-title">Appointments Today</div>
                        <div className="admin-card-value">
                            {stats?.appointments_today ?? "--"}
                        </div>
                    </div>

                    <div className="admin-card">
                        <div className="admin-card-title">Total Users</div>
                        <div className="admin-card-value">{stats?.total_users ?? "--"}</div>
                    </div>

                    <div className="admin-card">
                        <div className="admin-card-title">Slots Available Today</div>
                        <div className="admin-card-value">
                            {stats?.slots_available_today ?? "--"}
                        </div>
                    </div>
                </div>

                <div className="admin-panel">
                    <h3>Recent Appointments</h3>

                    <div className="admin-table">
                        <div className="admin-row head">
                            <span>Patient</span>
                            <span>Doctor</span>
                            <span>Time</span>
                            <span>Status</span>
                        </div>

                        {dashboard?.recent_appointments?.length ? (
                            dashboard.recent_appointments.map((a) => (
                                <div className="admin-row" key={a.id}>
                                    <span>{a.patient_name || "--"}</span>
                                    <span>{a.doctor_name || "--"}</span>
                                    <span>
                                        {a.date} {a.start_time}
                                    </span>
                                    <span
                                        className={`tag ${String(a.status).toLowerCase() === "completed" ? "done" : "pending"
                                            }`}
                                    >
                                        {String(a.status || "").toUpperCase()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: 12, fontWeight: 800, color: "#6b7280" }}>
                                No appointments yet.
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
