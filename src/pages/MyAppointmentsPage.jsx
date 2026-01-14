import { useEffect, useState } from "react";
import { cancelAppointmentApi, myAppointmentsApi } from "../api/appointments.api";
import { useToast } from "../context/ToastContext";
import "../styles/appointments.css";
import { useNavigate } from "react-router-dom";

const badgeClass = (status) => {
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

    const handleClick = () => {
        navigate('/checkout');
    }

    const extractList = (payload) => {
        // payload có thể là:
        // 1) ApiResponse: { success, data }
        // 2) paginator: { data: [...] }
        // 3) array: [...]
        const raw = payload?.data ?? payload;

        if (Array.isArray(raw)) return raw; // direct list

        // paginator dạng: { data: [...] }
        if (raw && Array.isArray(raw.data)) return raw.data;

        // ApiResponse -> data -> paginator -> data
        if (raw?.data && Array.isArray(raw.data.data)) return raw.data.data;

        return [];
    };

    const load = async () => {
        try {
            setLoading(true);

            const res = await myAppointmentsApi();

            console.log("MY APPOINTMENTS RES =", res);

            const list = extractList(res);
            setItems(list);

            if (list.length > 0) showToast(`Đã tải ${list.length} lịch hẹn`, "success", 2000);
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
                    {items.map((a) => (
                        <div className="apCard" key={a.id}>
                            <div className="apCard__top">
                                <div className="apCard__code">{a.appointment_code}</div>
                                <span className={badgeClass(a.status)}>{a.status}</span>
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
                                {a.status !== "completed" && a.status !== "cancelled" ? (
                                    <>


                                        <button onClick={handleClick} className="btnGreen">
                                            Pay Now
                                        </button>

                                        <button className="btnDanger" onClick={() => cancel(a.id)}>
                                            Cancel
                                        </button>


                                    </>



                                ) : (
                                    <button className="btnDisabled" disabled>
                                        Not allowed
                                    </button>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
