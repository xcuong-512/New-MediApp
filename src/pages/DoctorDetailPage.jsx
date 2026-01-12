import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoctorDetailApi, getDoctorSlotsApi } from "../api/doctors.api";
import { bookAppointmentApi } from "../api/appointments.api";
import { useToast } from "../context/ToastContext";
import "../styles/doctor-detail.css";

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

export default function DoctorDetailPage() {
    const { id } = useParams();
    const nav = useNavigate();
    const { showToast } = useToast();

    const [doctor, setDoctor] = useState(null);

    const [date, setDate] = useState("");
    const [slots, setSlots] = useState([]);
    const [note, setNote] = useState("");

    const [loadingDoctor, setLoadingDoctor] = useState(true);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [booking, setBooking] = useState(false);

    // load doctor profile
    useEffect(() => {
        const loadDoctor = async () => {
            try {
                setLoadingDoctor(true);
                const res = await getDoctorDetailApi(id);
                setDoctor(res.data);
            } catch (e) {
                console.error(e);
                showToast(e?.response?.data?.message || "Doctor not found", "error", 3500);
            } finally {
                setLoadingDoctor(false);
            }
        };

        loadDoctor();
    }, [id]);

    const avatar = useMemo(() => {
        if (!doctor) return "/doctor-default.png";
        return doctor.user?.avatar_url || "/doctor-default.png";
    }, [doctor]);

    // load slots by date
    const loadSlots = async () => {
        if (!date) {
            showToast("Vui lòng chọn ngày khám trước", "info", 2500);
            return;
        }

        try {
            setLoadingSlots(true);
            const res = await getDoctorSlotsApi({ doctorId: id, date });

            const list = res.data || [];
            const available = list.filter((s) => s.status === "available");

            setSlots(available);

            if (available.length === 0) {
                showToast("Ngày này không có slot trống 😢", "info", 2500);
            } else {
                showToast(`Đã load ${available.length} slot trống`, "success", 2200);
            }
        } catch (e) {
            console.error(e);
            showToast(e?.response?.data?.message || "Load slots failed", "error", 3500);
        } finally {
            setLoadingSlots(false);
        }
    };

    const handleBook = async (slotId) => {
        const token = localStorage.getItem("token");
        if (!token) {
            showToast("Bạn cần đăng nhập để đặt lịch", "info", 2500);
            return nav("/login");
        }

        const ok = confirm("Bạn chắc chắn muốn đặt lịch slot này?");
        if (!ok) return;

        try {
            setBooking(true);

            await bookAppointmentApi({
                doctor_id: Number(id),
                slot_id: slotId,
                type: "offline",
                symptom_note: note || null,
            });

            showToast("Đặt lịch thành công! 🎉", "success", 3500);
            nav("/appointments");
        } catch (e) {
            console.error(e);
            showToast(e?.response?.data?.message || "Booking failed", "error", 3500);
        } finally {
            setBooking(false);
        }
    };

    if (loadingDoctor) {
        return (
            <div className="detail container">
                <div className="detail__loading">Loading doctor profile...</div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="detail container">
                <div className="detail__loading">
                    Doctor not found. <Link to="/">Go back</Link>
                </div>
            </div>
        );
    }

    const rating = num(doctor.rating_avg, 0);
    const reviews = num(doctor.total_reviews, 0);

    return (
        <div className="detail container">
            <div className="detail__top">
                <Link className="back" to="/">
                    ← Back to doctors
                </Link>
            </div>

            <div className="detail__grid">
                {/* LEFT: Doctor profile */}
                <section className="profile">
                    <div className="profile__card">
                        <div className="profile__header">
                            <img className="profile__avatar" src={avatar} alt="avatar" />

                            <div className="profile__info">
                                <div className="profile__name">{doctor.user?.name}</div>

                                <div className="profile__sub">
                                    <span className="badge">{doctor.specialty?.name}</span>
                                    <span className="dotSep">•</span>
                                    <span className="muted">{num(doctor.experience_years, 0)}+ years exp</span>
                                </div>

                                <div className="profile__rating">
                                    <StarRating value={rating} />
                                    <span className="muted">
                                        {rating.toFixed(1)} ({reviews} reviews)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="profile__stats">
                            <div className="mini">
                                <div className="mini__label">Consultation</div>
                                <div className="mini__value">{formatMoney(doctor.consultation_fee || 0)}</div>
                            </div>

                            <div className="mini">
                                <div className="mini__label">Status</div>
                                <div className="mini__value ok">Available</div>
                            </div>

                            <div className="mini">
                                <div className="mini__label">Verified</div>
                                <div className="mini__value blue">Yes</div>
                            </div>
                        </div>

                        <div className="profile__bio">
                            <h3>About doctor</h3>
                            <p>
                                {doctor.bio ||
                                    "Bác sĩ có nhiều năm kinh nghiệm và tận tâm với bệnh nhân. Bạn có thể đặt lịch và nhận tư vấn ngay."}
                            </p>
                        </div>
                    </div>
                </section>

                {/* RIGHT: Booking */}
                <aside className="booking">
                    <div className="booking__card">
                        <div className="booking__head">
                            <div>
                                <div className="booking__title">Book appointment</div>
                                <div className="booking__desc">Chọn ngày và chọn slot còn trống.</div>
                            </div>

                            <div className="price">{formatMoney(doctor.consultation_fee || 0)}</div>
                        </div>

                        <div className="formRow">
                            <label className="label">Select date</label>
                            <div className="dateRow">
                                <input
                                    type="date"
                                    className="input"
                                    value={date}
                                    onChange={(e) => {
                                        setDate(e.target.value);
                                        setSlots([]);
                                    }}
                                />
                                <button className="btnPrimary" onClick={loadSlots} disabled={loadingSlots}>
                                    {loadingSlots ? "Loading..." : "Load"}
                                </button>
                            </div>
                        </div>

                        <div className="formRow">
                            <label className="label">Symptoms note (optional)</label>
                            <textarea
                                className="input"
                                rows={3}
                                value={note}
                                placeholder="Ví dụ: đau đầu 2 ngày, sốt nhẹ..."
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>

                        <div className="slotsWrap">
                            <div className="slotsTitle">Available slots</div>

                            {loadingSlots ? (
                                <div className="slotsGrid">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <div key={i} className="slotSkeleton" />
                                    ))}
                                </div>
                            ) : (
                                <div className="slotsGrid">
                                    {slots.length === 0 ? (
                                        <div className="empty">
                                            Chưa có slot nào. Bạn hãy chọn ngày khác hoặc bấm Load.
                                        </div>
                                    ) : (
                                        slots.map((s) => (
                                            <button
                                                key={s.id}
                                                className="slotBtn"
                                                onClick={() => handleBook(s.id)}
                                                disabled={booking}
                                                title={`Slot ${s.start_time} - ${s.end_time}`}
                                            >
                                                <div className="slotTime">{String(s.start_time).slice(0, 5)}</div>
                                                <div className="slotMeta">{booking ? "..." : "Book"}</div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="booking__note">
                            * Bạn cần đăng nhập để đặt lịch. Nếu chưa đăng nhập sẽ tự chuyển sang trang Login.
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
