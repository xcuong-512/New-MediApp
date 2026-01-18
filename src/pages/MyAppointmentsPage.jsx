import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    myAppointmentsApi,
    cancelAppointmentApi,
} from "../api/appointments.api";

export default function MyAppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelLoadingId, setCancelLoadingId] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await myAppointmentsApi();
            const list = res?.data?.data || res?.data?.data?.data || [];
            setAppointments(Array.isArray(list) ? list : []);
        } catch (e) {
            console.error(e);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getDoctorName = (a) =>
        a?.doctor?.user?.name ||
        a?.doctor_profile?.user?.name ||
        a?.doctorProfile?.user?.name ||
        "Doctor";

    const getFee = (a) =>
        Number(
            a?.doctor?.consultation_fee ||
            a?.doctor_profile?.consultation_fee ||
            a?.doctorProfile?.consultation_fee ||
            0
        );

    const formatMoney = (n) => Number(n || 0).toLocaleString("vi-VN") + " ₫";

    const canCancel = (status) => {
        return !["completed", "cancelled"].includes(String(status || ""));
    };

    const handleCancel = async (id) => {
        const ok = confirm("Bạn chắc chắn muốn hủy lịch khám này?");
        if (!ok) return;

        try {
            setCancelLoadingId(id);
            await cancelAppointmentApi(id);
            await fetchData();
        } catch (e) {
            console.error(e);
            alert("Cancel failed");
        } finally {
            setCancelLoadingId(null);
        }
    };

    if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

    return (
        <div style={{ padding: 24 }}>
            <h2 style={{ marginBottom: 16 }}>My Appointments</h2>

            {appointments.length === 0 ? (
                <p>Bạn chưa có lịch khám nào.</p>
            ) : (
                <div style={{ display: "grid", gap: 14 }}>
                    {appointments.map((a) => {
                        const uiStatus = a.status;
                        const showPayBtn = uiStatus === "pending";
                        const showCancelBtn = canCancel(uiStatus);

                        return (
                            <div
                                key={a.id}
                                style={{
                                    border: "1px solid #e7e7e7",
                                    borderRadius: 14,
                                    padding: 14,
                                    background: "#fff",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: 8,
                                    }}
                                >
                                    <b>{getDoctorName(a)}</b>

                                    <span
                                        style={{
                                            fontSize: 12,
                                            fontWeight: 700,
                                            padding: "6px 10px",
                                            borderRadius: 999,
                                            background:
                                                uiStatus === "deposit_paid"
                                                    ? "#e7fff1"
                                                    : uiStatus === "pending"
                                                        ? "#fff7e6"
                                                        : "#eef2ff",
                                            color:
                                                uiStatus === "deposit_paid"
                                                    ? "#0a7a43"
                                                    : uiStatus === "pending"
                                                        ? "#b05b00"
                                                        : "#3730a3",
                                        }}
                                    >
                                        {uiStatus}
                                    </span>
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>{a.date}</span>
                                    <span>
                                        {String(a.start_time).slice(0, 5)} -{" "}
                                        {String(a.end_time).slice(0, 5)}
                                    </span>
                                </div>

                                <div
                                    style={{
                                        marginTop: 10,
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <span>Fee</span>
                                    <b>{formatMoney(getFee(a))}</b>
                                </div>

                                <div style={{ marginTop: 12, display: "flex", gap: 10 }}>
                                    {showPayBtn ? (
                                        <Link
                                            to={`/checkout/${a.id}`}
                                            style={{
                                                textDecoration: "none",
                                                padding: "10px 14px",
                                                borderRadius: 12,
                                                fontWeight: 700,
                                                color: "#fff",
                                                background: "#111827",
                                            }}
                                        >
                                            Pay deposit
                                        </Link>
                                    ) : (
                                        <button
                                            disabled
                                            style={{
                                                padding: "10px 14px",
                                                borderRadius: 12,
                                                fontWeight: 700,
                                                background: "#f0fff6",
                                                border: "1px solid #b8f5d0",
                                                color: "#0a7a43",
                                            }}
                                        >
                                            Deposit paid ✅
                                        </button>
                                    )}

                                    {showCancelBtn && (
                                        <button
                                            onClick={() => handleCancel(a.id)}
                                            disabled={cancelLoadingId === a.id}
                                            style={{
                                                padding: "10px 14px",
                                                borderRadius: 12,
                                                fontWeight: 700,
                                                background: "#fff",
                                                border: "1px solid #ef4444",
                                                color: "#ef4444",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {cancelLoadingId === a.id ? "Cancelling..." : "Cancel"}
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
