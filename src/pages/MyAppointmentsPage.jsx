import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { cancelAppointmentApi, myAppointmentsApi } from "../api/appointments.api";
import { useToast } from "../context/ToastContext";
import "../styles/appointments.css";

function getPaidDeposits() {
    try {
        return JSON.parse(localStorage.getItem("paid_deposits") || "{}");
    } catch {
        return {};
    }
}

const badgeClass = (status, depositPaid) => {
    if (depositPaid) return "badge badge--confirmed";

    if (status === "pending") return "badge badge--pending";
    if (status === "confirmed") return "badge badge--confirmed";
    if (status === "completed") return "badge badge--completed";
    if (status === "cancelled") return "badge badge--cancelled";
    return "badge";
};

export default function MyAppointmentsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const navigate = useNavigate();

    const load = async () => {
        try {
            setLoading(true);

            const res = await myAppointmentsApi();
            const paginator = res?.data;
            const list = paginator?.data || [];

            setItems(list);
        } catch (e) {
            console.error(e);
            showToast(e?.response?.data?.message || "Load appointments failed", "error", 3500);
        } finally {
            setLoading(false);
        }
    };

    const cancel = async (id) => {
        const ok = confirm("Bạn chắc chắn muốn hủy lịch hẹn?");
        if (!ok) return;

        try {
            await cancelAppointmentApi(id);
            showToast("Đã hủy lịch", "success", 2500);
            await load();
        } catch (e) {
            showToast(e?.response?.data?.message || "Cancel failed", "error", 3500);
        }
    };

    const payNow = (appointmentId) => {
        navigate(`/checkout/${appointmentId}`);
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="ap container">
            <div className="ap__head">
                <h2>My Appointments</h2>
                <p>Danh sách lịch khám của bạn</p>
            </div>

            {loading ? (
                <div className="ap__loading">Loading...</div>
            ) : items.length === 0 ? (
                <div className="ap__empty">Bạn chưa có lịch khám nào.</div>
            ) : (
                <div className="ap__grid">
                    {items.map((a) => {
                        const doctorName = a.doctor_profile?.user?.name || "Doctor";
                        const doctorAvatar = a.doctor_profile?.user?.avatar_url || "/doctor-default.png";
                        const specialty = a.doctor_profile?.specialty?.name || "Specialty";
                        const branchName = a.clinic_branch?.name || "Clinic branch";

                        const deposits = getPaidDeposits();
                        const depositPaid = deposits[String(a.id)] === true;

                        const canCancel = a.status !== "completed" && a.status !== "cancelled";
                        const canPay = (a.status === "pending" || a.status === "confirmed") && !depositPaid;

                        return (
                            <div className="apCard apCard--rich" key={a.id}>
                                <div className="apCard__top">
                                    <div className="apCard__code">{a.appointment_code}</div>

                                    <span className={badgeClass(a.status, depositPaid)}>
                                        {depositPaid ? "deposit paid" : a.status}
                                    </span>
                                </div>

                                <div className="apDoc">
                                    <img className="apDoc__avatar" src={doctorAvatar} alt="avatar" />
                                    <div className="apDoc__info">
                                        <div className="apDoc__name">{doctorName}</div>
                                        <div className="apDoc__meta">
                                            <span className="miniTag">{specialty}</span>
                                            <span className="dotSep">•</span>
                                            <span className="muted">{branchName}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="apCard__row">
                                    <div className="label">Date</div>
                                    <div className="value">{a.date}</div>
                                </div>

                                <div className="apCard__row">
                                    <div className="label">Time</div>
                                    <div className="value">
                                        {String(a.start_time).slice(0, 5)} - {String(a.end_time).slice(0, 5)}
                                    </div>
                                </div>

                                <div className="apCard__row">
                                    <div className="label">Type</div>
                                    <div className="value">{a.type}</div>
                                </div>

                                {a.symptom_note ? (
                                    <div className="apCard__note">
                                        <div className="label">Note</div>
                                        <div className="value">{a.symptom_note}</div>
                                    </div>
                                ) : null}

                                <div className="apCard__actions">
                                    {depositPaid ? (
                                        <button className="btnDisabled" disabled>
                                            Deposit paid ✅
                                        </button>
                                    ) : canPay ? (
                                        <button className="btnPayNow" onClick={() => payNow(a.id)}>
                                            Pay deposit
                                        </button>
                                    ) : (
                                        <button className="btnDisabled" disabled>
                                            Paid / N/A
                                        </button>
                                    )}

                                    {canCancel ? (
                                        <button className="btnDanger" onClick={() => cancel(a.id)}>
                                            Cancel
                                        </button>
                                    ) : (
                                        <button className="btnDisabled" disabled>
                                            Not allowed
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
