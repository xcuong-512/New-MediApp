import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/auth.api";
import "../styles/form.css";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const nav = useNavigate();
    const { fetchMe } = useAuth();
    const [email, setEmail] = useState("patient@mediconnect.local");
    const [password, setPassword] = useState("123456");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await loginApi({ email, password });
            const token = res.data.access_token;
            localStorage.setItem("token", token);
            await fetchMe();
            nav("/");
        } catch (err) {
            alert(err?.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form-card">
                <h1 className="form-title">Login</h1>

                <form onSubmit={submit} className="form">
                    <label className="label">Email</label>
                    <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />

                    <label className="label">Password</label>
                    <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

                    <button className="btn btn--primary" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}
