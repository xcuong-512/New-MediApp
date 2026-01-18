import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/Checkoutpage.css";
import { myAppointmentsApi, payDepositApi } from "../api/appointments.api";

function formatMoney(vnd) {
    const n = Number(vnd);
    if (!Number.isFinite(n)) return "0 ₫";
    return n.toLocaleString("vi-VN") + " ₫";
}

function maskCardNumber(v) {
    const digits = (v || "").replace(/\D/g, "").slice(0, 16);
    const parts = digits.match(/.{1,4}/g) || [];
    return parts.join(" ");
}

export default function CheckoutPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [apptInfo, setApptInfo] = useState(null);
    const [loadingAppt, setLoadingAppt] = useState(true);

    const [method, setMethod] = useState("card");
    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const [loadingPay, setLoadingPay] = useState(false);
    const [paidSuccess, setPaidSuccess] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const depositPercent = 0.2;

    const isCardFormValid =
        cardName.trim().length >= 2 &&
        cardNumber.replace(/\D/g, "").length >= 16 &&
        expiry.trim().length >= 4 &&
        cvv.trim().length >= 3;

    const fetchAppt = async () => {
        try {
            setLoadingAppt(true);

            const res = await myAppointmentsApi();
            const list = res?.data?.data?.data || res?.data?.data || [];
            const appt = (Array.isArray(list) ? list : []).find(
                (x) => String(x.id) === String(id)
            );

            setApptInfo(appt || null);
        } catch (e) {
            console.error("fetch appointment error:", e);
            setApptInfo(null);
        } finally {
            setLoadingAppt(false);
        }
    };

    useEffect(() => {
        fetchAppt();
    }, [id]);

    useEffect(() => {
        if (!paidSuccess) return;

        setCountdown(5);

        const t = setInterval(() => {
            setCountdown((c) => c - 1);
        }, 1000);

        const to = setTimeout(() => {
            navigate("/appointments");
        }, 5000);

        return () => {
            clearInterval(t);
            clearTimeout(to);
        };
    }, [paidSuccess, navigate]);

    const doctorName =
        apptInfo?.doctor?.user?.name ||
        apptInfo?.doctor_profile?.user?.name ||
        apptInfo?.doctorProfile?.user?.name ||
        "Doctor";

    const specialty =
        apptInfo?.doctor?.specialty?.name ||
        apptInfo?.doctor_profile?.specialty?.name ||
        apptInfo?.doctorProfile?.specialty?.name ||
        "Specialty";

    const clinic =
        apptInfo?.clinic_branch?.name ||
        apptInfo?.clinicBranch?.name ||
        "Clinic";

    const totalFee = Number(
        apptInfo?.doctor?.consultation_fee ||
        apptInfo?.doctor_profile?.consultation_fee ||
        apptInfo?.doctorProfile?.consultation_fee ||
        apptInfo?.consultation_fee ||
        0
    );

    const deposit = Math.round(totalFee * depositPercent);
    const remaining = Math.max(totalFee - deposit, 0);

    const handlePay = async () => {
        try {
            if (!apptInfo?.id) {
                alert("Appointment not found. Please reload page.");
                return;
            }

            if (method === "card" && !isCardFormValid) return;

            if (loadingPay) return;

            setLoadingPay(true);

            await new Promise((r) => setTimeout(r, 900));

            const res = await payDepositApi(apptInfo.id);

            const updatedAppt = res?.data || null;
            if (updatedAppt) setApptInfo(updatedAppt);

            setPaidSuccess(true);
        } catch (err) {
            console.error("Payment error:", err);
            alert(err?.response?.data?.message || "Payment failed. Please try again.");
        } finally {
            setLoadingPay(false);
        }
    };

    if (loadingAppt) {
        return (
            <div className="checkoutWrap">
                <div className="payBox">Loading appointment...</div>
            </div>
        );
    }

    if (!apptInfo) {
        return (
            <div className="checkoutWrap">
                <div className="payBox">
                    Appointment not found. <Link to="/appointments">Go back</Link>
                </div>
            </div>
        );
    }

    if (paidSuccess) {
        return (
            <div className="checkoutWrap">
                <div className="paySuccessCard">
                    <div className="paySuccessIcon">✓</div>
                    <div className="paySuccessTitle">Payment successful</div>
                    <div className="paySuccessSub">
                        Bạn đã đặt cọc thành công <b>{formatMoney(deposit)}</b> để giữ lịch.
                    </div>

                    <div className="paySuccessTable">
                        <div className="row">
                            <div className="k">Doctor</div>
                            <div className="v">{doctorName}</div>
                        </div>
                        <div className="row">
                            <div className="k">Appointment</div>
                            <div className="v">{apptInfo.appointment_code}</div>
                        </div>
                        <div className="row">
                            <div className="k">Deposit (20%)</div>
                            <div className="v">{formatMoney(deposit)}</div>
                        </div>
                        <div className="row">
                            <div className="k">Remaining</div>
                            <div className="v">{formatMoney(remaining)}</div>
                        </div>
                    </div>

                    <button className="btnBackAppt" onClick={() => navigate("/appointments")}>
                        Back to My Appointments
                    </button>

                    <div className="payAutoText">
                        Auto redirect in {Math.max(countdown, 0)}s...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkoutWrap">
            <div className="checkoutHeader">
                <div className="brandLeft">
                    <div className="brandLogo">MC</div>
                    <div>
                        <div className="brandName">MediConnect</div>
                        <div className="brandSub">Secure checkout</div>
                        <div className="sslText">256-bit SSL Secure</div>
                    </div>
                </div>

                <div className="secureBadge">
                    <span className="dotGreen" />
                    <span>256-bit SSL Secure</span>
                </div>
            </div>

            <div className="checkoutTitle">Proceed to Payment</div>
            <div className="checkoutSub">
                Đây là thanh toán <b>đặt cọc 20%</b> để giữ chỗ, tránh tình trạng spam lịch.
            </div>

            <div className="checkoutGrid">
                {/* LEFT */}
                <div className="payCard">
                    <div className="payCardTop">
                        <div className="payCardTitle">Deposit Payment</div>
                        <div className="pillAmount">{formatMoney(deposit)}</div>
                    </div>

                    <div className="feeBox">
                        <div className="feeRow">
                            <span>Total fee</span>
                            <b>{formatMoney(totalFee)}</b>
                        </div>
                        <div className="feeRow">
                            <span>Deposit (20%)</span>
                            <b>{formatMoney(deposit)}</b>
                        </div>
                        <div className="feeRow">
                            <span>Remaining</span>
                            <b>{formatMoney(remaining)}</b>
                        </div>
                    </div>

                    <div className="methodTabs">
                        <button
                            className={method === "card" ? "tab active" : "tab"}
                            onClick={() => setMethod("card")}
                            type="button"
                        >
                            Card
                        </button>
                        <button
                            className={method === "bank" ? "tab active" : "tab"}
                            onClick={() => setMethod("bank")}
                            type="button"
                        >
                            Bank
                        </button>
                        <button
                            className={method === "transfer" ? "tab active" : "tab"}
                            onClick={() => setMethod("transfer")}
                            type="button"
                        >
                            Transfer
                        </button>
                    </div>

                    {method === "card" ? (
                        <div className="form">
                            <label>Cardholder name</label>
                            <input
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                placeholder="VD: Nguyen Van A"
                            />

                            <label>Card number</label>
                            <input
                                value={cardNumber}
                                onChange={(e) => setCardNumber(maskCardNumber(e.target.value))}
                                placeholder="1234 5678 9012 3456"
                            />

                            <div className="formRow">
                                <div>
                                    <label>Expiry</label>
                                    <input
                                        value={expiry}
                                        onChange={(e) => setExpiry(e.target.value)}
                                        placeholder="MM/YY"
                                    />
                                </div>
                                <div>
                                    <label>CVV</label>
                                    <input
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                        placeholder="123"
                                    />
                                </div>
                            </div>

                            {!isCardFormValid && (
                                <div className="hintRed">* Please enter valid card info.</div>
                            )}
                        </div>
                    ) : (
                        <div className="hintInfo">
                            Demo method: <b>{method}</b>
                        </div>
                    )}

                    <button
                        className="btnPayDeposit"
                        onClick={handlePay}
                        disabled={
                            loadingPay ||
                            !apptInfo?.id ||
                            (method === "card" && !isCardFormValid)
                        }
                    >
                        {loadingPay
                            ? "Processing..."
                            : `Pay deposit ${formatMoney(deposit)}`}
                    </button>

                    <div className="demoNote">
                        * Đây là demo thanh toán (nhưng status sẽ cập nhật DB).
                    </div>
                </div>

                {/* RIGHT */}
                <div className="summaryCard">
                    <div className="summaryTitle">Appointment summary</div>

                    <div className="sumRow">
                        <span>Code</span>
                        <b>{apptInfo.appointment_code}</b>
                    </div>

                    <div className="sumRow">
                        <span>Doctor</span>
                        <b>{doctorName}</b>
                    </div>

                    <div className="sumRow">
                        <span>Specialty</span>
                        <b>{specialty}</b>
                    </div>

                    <div className="sumRow">
                        <span>Date</span>
                        <b>{apptInfo.date}</b>
                    </div>

                    <div className="sumRow">
                        <span>Time</span>
                        <b>
                            {String(apptInfo.start_time).slice(0, 5)} -{" "}
                            {String(apptInfo.end_time).slice(0, 5)}
                        </b>
                    </div>

                    <div className="sumRow">
                        <span>Clinic</span>
                        <b>{clinic}</b>
                    </div>

                    <hr className="sumHr" />

                    <div className="sumPay">
                        <span>Deposit now</span>
                        <b>{formatMoney(deposit)}</b>
                    </div>

                    <ul className="sumList">
                        <li>✅ Deposit giữ slot</li>
                        <li>✅ Chống spam lịch</li>
                        <li>✅ Support 24/7</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
