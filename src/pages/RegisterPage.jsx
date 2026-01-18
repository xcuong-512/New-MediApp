import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from '../api/auth.api'
import "../styles/register.css";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        // validate
        if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
            return setError("Vui lòng nhập đầy đủ thông tin.");
        }
        if (form.password.length < 6) {
            return setError("Mật khẩu phải ít nhất 6 ký tự.");
        }
        if (form.password !== form.confirmPassword) {
            return setError("Mật khẩu nhập lại không khớp.");
        }

        try {
            setLoading(true);
            await registerApi({
                name: form.fullName,
                email: form.email,
                password: form.password,
                password_confirmation: form.confirmPassword
            });


            navigate("/login");
        } catch (e) {
            setError(e?.message || "Đăng ký thất bại!");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="register-page">
            <div className="register-card">
                <h1 className="register-title">Create account</h1>
                <p className="register-subtitle">MediConnect</p>

                <form className="register-form" onSubmit={handleSubmit}>
                    <label className="register-label">Full name</label>
                    <input
                        className="register-input"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                    />

                    <label className="register-label">Email</label>
                    <input
                        className="register-input"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@gmail.com"
                    />

                    <label className="register-label">Password</label>
                    <input
                        className="register-input"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="******"
                    />

                    <label className="register-label">Confirm password</label>
                    <input
                        className="register-input"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        placeholder="******"
                    />

                    {error && <div className="register-alert">{error}</div>}

                    <button className="register-btn" disabled={loading}>
                        {loading ? "Creating..." : "Register"}
                    </button>
                </form>

                <div className="register-footer">
                    <span>Already have an account?</span>
                    <Link to="/login" className="register-link">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
