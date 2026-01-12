import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getDoctorsApi, getSpecialtiesApi } from "../api/doctors.api";
import "../styles/home.css";

function formatMoney(vnd) {
    const n = Number(vnd);
    if (!Number.isFinite(n)) return "0 ₫";
    return n.toLocaleString("vi-VN") + " ₫";
}

const num = (v, fallback = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
};

function StarRating({ value = 0 }) {
    const stars = [];
    const full = Math.round(num(value, 0));

    for (let i = 1; i <= 5; i++) {
        stars.push(
            <span key={i} className={i <= full ? "star star--on" : "star"}>
                ★
            </span>
        );
    }
    return <div className="stars">{stars}</div>;
}

export default function DoctorsPage() {
    const [specialties, setSpecialties] = useState([]);
    const [doctors, setDoctors] = useState([]);

    const [q, setQ] = useState("");
    const [specialtyId, setSpecialtyId] = useState("");

    const [loading, setLoading] = useState(true);

    const activeSpecialtyName = useMemo(() => {
        if (!specialtyId) return "All specialties";
        return specialties.find((s) => String(s.id) === String(specialtyId))?.name || "Specialty";
    }, [specialties, specialtyId]);

    const load = async () => {
        try {
            setLoading(true);

            const [specRes, docRes] = await Promise.all([
                getSpecialtiesApi(),
                getDoctorsApi({
                    q: q || undefined,
                    specialty_id: specialtyId || undefined,
                }),
            ]);

            setSpecialties(specRes.data || []);

            const raw = docRes.data;
            const list = Array.isArray(raw)
                ? raw
                : Array.isArray(raw?.data)
                    ? raw.data
                    : [];

            setDoctors(list);
        } catch (e) {
            console.error(e);
            alert(e?.response?.data?.message || "Load doctors failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load().catch(console.log);
        // eslint-disable-next-line
    }, []);

    return (
        <div className="home">
            {/* HERO */}
            <section className="hero">
                <div className="hero__content">
                    <p className="hero__badge">MediConnect Platform</p>

                    <h1 className="hero__title">Đặt lịch khám với bác sĩ dễ dàng</h1>

                    <p className="hero__subtitle">
                        Tìm kiếm bác sĩ theo chuyên khoa, kiểm tra lịch trống và đặt lịch ngay lập tức.
                    </p>

                    <div className="searchbar">
                        <div className="searchbar__icon">⌕</div>

                        <input
                            className="searchbar__input"
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder="Nhập tên bác sĩ..."
                        />

                        <div className="searchbar__divider" />

                        <select
                            className="searchbar__select"
                            value={specialtyId}
                            onChange={(e) => setSpecialtyId(e.target.value)}
                            title={activeSpecialtyName}
                        >
                            <option value="">Tất cả chuyên khoa</option>
                            {specialties.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>

                        <button className="searchbar__btn" onClick={load}>
                            Tìm kiếm
                        </button>
                    </div>

                    <div className="hero__stats">
                        <div className="stat">
                            <div className="stat__num">{Math.max(doctors.length, 8)}+</div>
                            <div className="stat__label">Bác sĩ</div>
                        </div>

                        <div className="stat">
                            <div className="stat__num">{Math.max(specialties.length, 10)}+</div>
                            <div className="stat__label">Chuyên khoa</div>
                        </div>

                        <div className="stat">
                            <div className="stat__num">24/7</div>
                            <div className="stat__label">Đặt lịch</div>
                        </div>
                    </div>
                </div>

                <div className="hero__art">
                    <div className="art-card">
                        <div className="art-card__top">
                            <div className="pulse" />
                            <div className="art-card__title">Gợi ý nhanh</div>
                        </div>

                        <div className="art-card__item">
                            <div className="avatar avatar--sm">MC</div>
                            <div>
                                <div className="art-card__name">Chọn bác sĩ</div>
                                <div className="art-card__meta">Theo chuyên khoa bạn muốn</div>
                            </div>
                            <div className="chip chip--blue">Care</div>
                        </div>

                        <div className="art-card__line" />

                        <div className="art-card__item">
                            <div className="avatar avatar--sm">✓</div>
                            <div>
                                <div className="art-card__name">Đặt lịch</div>
                                <div className="art-card__meta">Nhanh, tiện và an toàn</div>
                            </div>
                            <div className="chip chip--ok">OK</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES */}
            <section className="services" id="services">
                <div className="services__head">
                    <h2 className="section__title">Dịch vụ</h2>
                    <p className="section__desc">Tất cả những gì bạn cần để đặt lịch khám thông minh.</p>
                </div>

                <div className="services__grid">
                    <div className="service">
                        <div className="service__icon">🩺</div>
                        <div className="service__title">Đặt lịch bác sĩ</div>
                        <div className="service__desc">Chọn bác sĩ, chọn giờ, đặt lịch ngay.</div>
                    </div>

                    <div className="service">
                        <div className="service__icon">📅</div>
                        <div className="service__title">Quản lý lịch hẹn</div>
                        <div className="service__desc">Xem lịch, hủy lịch dễ dàng.</div>
                    </div>

                    <div className="service">
                        <div className="service__icon">🔒</div>
                        <div className="service__title">Tài khoản bảo mật</div>
                        <div className="service__desc">Đăng nhập bằng token (Sanctum).</div>
                    </div>

                    <div className="service">
                        <div className="service__icon">⚡</div>
                        <div className="service__title">Slots tự động</div>
                        <div className="service__desc">Tự sinh lịch khám theo giờ làm việc.</div>
                    </div>
                </div>
            </section>

            {/* DOCTORS LIST */}
            <section className="section">
                <div className="section__head">
                    <h2 className="section__title">Recommended Doctors</h2>
                    <p className="section__desc">Chọn bác sĩ phù hợp và đặt lịch ngay.</p>
                </div>

                {loading ? (
                    <div className="grid">
                        {Array.from({ length: 6 }).map((_, idx) => (
                            <div className="doctor skeleton" key={idx} />
                        ))}
                    </div>
                ) : doctors.length === 0 ? (
                    <div className="empty" style={{ marginTop: 10 }}>
                        Không tìm thấy bác sĩ phù hợp.
                    </div>
                ) : (
                    <div className="grid">
                        {doctors.map((d) => {
                            const rating = num(d.rating_avg, 0);
                            const reviews = num(d.total_reviews, 0);

                            const avatar =
                                d.user?.avatar_url ||
                                "/doctor-default.png";

                            return (
                                <div key={d.id} className="doctor">
                                    {/* header */}
                                    <div className="doctor__top">
                                        <div className="doctor__left">
                                            <img className="avatarImg" src={avatar} alt="avatar" />

                                            <div className="doctor__meta">
                                                <div className="doctor__name">{d.user?.name}</div>
                                                <div className="doctor__spec">{d.specialty?.name}</div>
                                            </div>
                                        </div>

                                        <div className="doctor__rating">
                                            <StarRating value={rating} />
                                            <span className="doctor__ratingText">
                                                {rating.toFixed(1)} ({reviews})
                                            </span>
                                        </div>
                                    </div>

                                    {/* content */}
                                    <div className="doctor__body">
                                        <div className="tags">
                                            <span className="tag">{num(d.experience_years, 0)}+ yrs</span>
                                            <span className="tag tag--blue">Verified</span>
                                            <span className="tag tag--ok">Available</span>
                                        </div>

                                        <div className="fee">
                                            <span className="fee__label">Consultation fee</span>
                                            <span className="fee__value">{formatMoney(d.consultation_fee || 0)}</span>
                                        </div>
                                    </div>

                                    {/* actions */}
                                    <div className="doctor__actions">
                                        <Link className="btn2 btn2--outline" to={`/doctors/${d.id}`}>
                                            View details
                                        </Link>
                                        <Link className="btn2 btn2--primary" to={`/doctors/${d.id}`}>
                                            Book now
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}
