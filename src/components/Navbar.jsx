import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const nav = useNavigate();
    const token = localStorage.getItem("token");
    const { user, setUser } = useAuth();

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        nav("/login");
    };

    return (
        <header className="navbar">
            <div className="navbar__inner">
                <div className="navbar__brand" onClick={() => nav("/")}>
                    <div className="navbar__logo">MC</div>
                    <div className="navbar__brandText">
                        <div className="navbar__title">MediConnect</div>
                        <div className="navbar__subtitle">Healthcare booking</div>
                    </div>
                </div>

                <nav className="navbar__nav">
                    <NavLink to="/" className={({ isActive }) => (isActive ? "navitem navitem--active" : "navitem")}>
                        Home
                    </NavLink>

                    <NavLink to="/services" className="navitem">
                        Services
                    </NavLink>

                    <NavLink to="/appointments" className={({ isActive }) => (isActive ? "navitem navitem--active" : "navitem")}>
                        Appointments
                    </NavLink>
                </nav>

                <div className="navbar__right">
                    <div className="navbar__status">
                        <span className={`dot ${token ? "dot--ok" : "dot--off"}`} />
                        {token ? (
                            <span>
                                Hi, <b>{user?.name || "User"}</b>
                            </span>
                        ) : (
                            "Guest"
                        )}
                    </div>

                    {!token ? (
                        <NavLink to="/login" className="btnnav btnnav--primary">
                            Login
                        </NavLink>
                    ) : (
                        <button className="btnnav btnnav--danger" onClick={logout}>
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
