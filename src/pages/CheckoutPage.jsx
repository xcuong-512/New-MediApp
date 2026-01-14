import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/Checkoutpage.css";
import { myAppointmentsApi } from "../api/appointments.api";

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

function maskMMYY(v) {
    const digits = (v || "").replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function isValidCardNumber(v) {
    const digits = (v || "").replace(/\D/g, "");
    return digits.length === 16;
}
function isValidMMYY(v) {
    const digits = (v || "").replace(/\D/g, "");
    if (digits.length !== 4) return false;
    const mm = Number(digits.slice(0, 2));
    const yy = Number(digits.slice(2, 4));
    return mm >= 1 && mm <= 12 && yy >= 0;
}
function isValidCVV(v) {
    const digits = (v || "").replace(/\D/g, "");
    return digits.length === 3;
}

function getPaidDeposits() {
    try {
        return JSON.parse(localStorage.getItem("paid_deposits") || "{}");
    } catch {
        return {};
    }
}

export default function CheckoutPage() {
    const nav = useNavigate();
    const { id } = useParams(); // appointment id

    const [appointment, setAppointment] = useState(null);
    const [loadingAppt, setLoadingAppt] = useState(true);

    const [method, setMethod] = useState("card"); // card | bank | transfer
    const [saveCard, setSaveCard] = useState(true);

    const [cardName, setCardName] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [cardExp, setCardExp] = useState("");
    const [cardCVV, setCardCVV] = useState("");

    const [bankCode, setBankCode] = useState("VCB");
    const [loadingPay, setLoadingPay] = useState(false);

    // ✅ success flow
    const [paidSuccess, setPaidSuccess] = useState(false);
    const [countdown, setCountdown] = useState(5);

    // ✅ Load appointment REAL from API
    useEffect(() => {
        const load = async () => {
            try {
                setLoadingAppt(true);

                const res = await myAppointmentsApi();
                const paginator = res?.data;
                const list = paginator?.data || [];

                const found = list.find((a) => String(a.id) === String(id));
                setAppointment(found || null);
            } catch (e) {
                console.error(e);
                setAppointment(null);
            } finally {
                setLoadingAppt(false);
            }
        };

        load();
    }, [id]);

    // ✅ Extract info from appointment
    const apptInfo = useMemo(() => {
        if (!appointment) return null;

        const doctorName = appointment.doctor_profile?.user?.name || "Doctor";
        const specialty = appointment.doctor_profile?.specialty?.name || "Specialty";
        const branch = appointment.clinic_branch?.name || "Clinic branch";

        const time =
            `${String(appointment.start_time).slice(0, 5)} - ${String(appointment.end_time).slice(0, 5)}`;

        return {
            id: appointment.id,
            appointment_code: appointment.appointment_code,
            doctorName,
            specialty,
            date: appointment.date,
            time,
            branch,
            status: appointment.status,
        };
    }, [appointment]);

    // ✅ Total fee
    const totalFee = useMemo(() => {
        const fee = appointment?.doctor_profile?.consultation_fee;
        return Number(fee || 0);
    }, [appointment]);

    // ✅ Deposit 10%
    const depositRate = 0.1;
    const depositAmount = useMemo(() => Math.round(totalFee * depositRate), [totalFee]);
    const remainingAmount = useMemo(() => totalFee - depositAmount, [totalFee, depositAmount]);

    const depositPaid = useMemo(() => {
        if (!apptInfo?.id) return false;
        const paid = getPaidDeposits();
        return paid[String(apptInfo.id)] === true;
    }, [apptInfo?.id]);

    const isCardFormValid =
        cardName.trim().length >= 2 &&
        isValidCardNumber(cardNumber) &&
        isValidMMYY(cardExp) &&
        isValidCVV(cardCVV);

    // ✅ redirect after success
    useEffect(() => {
        if (!paidSuccess) return;

        setCountdown(5);

        const t = setInterval(() => {
            setCountdown((c) => c - 1);
        }, 1000);

        const navTimer = setTimeout(() => {
            nav("/appointments");
        }, 5000);

        return () => {
            clearInterval(t);
            clearTimeout(navTimer);
        };
    }, [paidSuccess]);

    const handlePay = async () => {
        try {
            if (depositPaid) return;
            if (method === "card" && !isCardFormValid) return;

            setLoadingPay(true);

            // DEMO processing
            await new Promise((r) => setTimeout(r, 900));

            // ✅ mark deposit paid in localStorage
            const paid = getPaidDeposits();
            paid[String(apptInfo.id)] = true;
            localStorage.setItem("paid_deposits", JSON.stringify(paid));

            // ✅ show success screen
            setPaidSuccess(true);
        } finally {
            setLoadingPay(false);
        }
    };

    // UI states
    if (loadingAppt) {
        return (
            <div className="checkoutWrap">
                <div className="checkoutHeader">
                    <div className="checkoutBrand">
                        <div className="logoCircle">MC</div>
                        <div>
                            <div className="brandName">MediConnect</div>
                            <div className="brandSub">Secure checkout</div>
                        </div>
                    </div>
                </div>

                <div className="payBox">Loading appointment...</div>
            </div>
        );
    }

    if (!appointment || !apptInfo) {
        return (
            <div className="checkoutWrap">
                <div className="payBox">
                    Appointment not found. <Link to="/appointments">Go back</Link>
                </div>
            </div>
        );
    }

    // ✅ success screen professional
    if (paidSuccess) {
        return (
            <div className="checkoutWrap">
                <div className="successCard">
                    <div className="successIcon">✓</div>

                    <h1>Deposit payment successful</h1>
                    <p>
                        Bạn đã đặt cọc thành công <b>{formatMoney(depositAmount)}</b> để giữ chỗ.
                    </p>

                    <div className="successSummary">
                        <div className="row">
                            <span>Appointment</span>
                            <b>{apptInfo.appointment_code || `#${apptInfo.id}`}</b>
                        </div>

                        <div className="row">
                            <span>Total fee</span>
                            <b>{formatMoney(totalFee)}</b>
                        </div>

                        <div className="row">
                            <span>Deposit (10%)</span>
                            <b>{formatMoney(depositAmount)}</b>
                        </div>

                        <div className="row">
                            <span>Remaining</span>
                            <b>{formatMoney(remainingAmount)}</b>
                        </div>
                    </div>

                    <div className="successActions">
                        <button className="btnPrimary" onClick={() => nav("/appointments")}>
                            Back to My Appointments
                        </button>

                        <div className="muted">
                            Auto redirect in <b>{countdown}</b>s...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkoutWrap">
            <div className="checkoutHeader">
                <div className="checkoutBrand">
                    <div className="logoCircle">MC</div>
                    <div>
                        <div className="brandName">MediConnect</div>
                        <div className="brandSub">Secure checkout</div>
                    </div>
                </div>

                <div className="secureTag">
                    <span className="lockDot" /> 256-bit SSL Secure
                </div>
            </div>

            <div className="checkoutGrid">
                {/* LEFT */}
                <section className="checkoutCard">
                    <div className="sectionTitle">
                        <h1>Proceed to Payment</h1>
                        <p>
                            Đây là thanh toán <b>đặt cọc 10%</b> để giữ chỗ, tránh tình trạng spam lịch.
                        </p>
                    </div>

                    <div className="payBox">
                        <div className="payBoxHead">
                            <h2>Deposit Payment</h2>
                            <div className="payAmount">{formatMoney(depositAmount)}</div>
                        </div>

                        <hr className="separator" />

                        <div className="depositBreakdown">
                            <div className="drow">
                                <span>Total fee</span>
                                <b>{formatMoney(totalFee)}</b>
                            </div>
                            <div className="drow">
                                <span>Deposit (10%)</span>
                                <b>{formatMoney(depositAmount)}</b>
                            </div>
                            <div className="drow">
                                <span>Remaining</span>
                                <b>{formatMoney(remainingAmount)}</b>
                            </div>
                        </div>

                        <div className="payment_methods">
                            <label className={`radio_item ${method === "card" ? "active" : ""}`}>
                                <input
                                    className="payment_input"
                                    type="radio"
                                    name="pay"
                                    checked={method === "card"}
                                    onChange={() => setMethod("card")}
                                />
                                <span>Card</span>
                            </label>

                            <label className={`radio_item ${method === "bank" ? "active" : ""}`}>
                                <input
                                    className="payment_input"
                                    type="radio"
                                    name="pay"
                                    checked={method === "bank"}
                                    onChange={() => setMethod("bank")}
                                />
                                <span>Bank</span>
                            </label>

                            <label className={`radio_item ${method === "transfer" ? "active" : ""}`}>
                                <input
                                    className="payment_input"
                                    type="radio"
                                    name="pay"
                                    checked={method === "transfer"}
                                    onChange={() => setMethod("transfer")}
                                />
                                <span>Transfer</span>
                            </label>
                        </div>

                        {method === "card" && (
                            <div className="payForm">
                                <div className="field">
                                    <label>Cardholder name</label>
                                    <input
                                        value={cardName}
                                        onChange={(e) => setCardName(e.target.value)}
                                        placeholder="VD: Nguyen Van A"
                                        autoComplete="cc-name"
                                    />
                                </div>

                                <div className="field">
                                    <label>Card number</label>
                                    <input
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(maskCardNumber(e.target.value))}
                                        placeholder="1234 5678 9012 3456"
                                        autoComplete="cc-number"
                                        inputMode="numeric"
                                    />
                                </div>

                                <div className="payment_row">
                                    <div className="field">
                                        <label>Expiry</label>
                                        <input
                                            value={cardExp}
                                            onChange={(e) => setCardExp(maskMMYY(e.target.value))}
                                            placeholder="MM/YY"
                                            autoComplete="cc-exp"
                                            inputMode="numeric"
                                        />
                                    </div>

                                    <div className="field">
                                        <label>CVV</label>
                                        <input
                                            value={cardCVV}
                                            onChange={(e) => setCardCVV(e.target.value.replace(/\D/g, "").slice(0, 3))}
                                            placeholder="123"
                                            autoComplete="cc-csc"
                                            inputMode="numeric"
                                        />
                                    </div>
                                </div>

                                <label className="check_box">
                                    <input
                                        type="checkbox"
                                        checked={saveCard}
                                        onChange={(e) => setSaveCard(e.target.checked)}
                                    />
                                    <span>Save card details for next time</span>
                                </label>

                                {!isCardFormValid ? (
                                    <div className="hintError">* Please enter valid card information.</div>
                                ) : (
                                    <div className="hintOk">Looks good ✅</div>
                                )}
                            </div>
                        )}

                        {method === "bank" && (
                            <div className="payForm">
                                <div className="field">
                                    <label>Select bank</label>
                                    <select value={bankCode} onChange={(e) => setBankCode(e.target.value)}>
                                        <option value="VCB">Vietcombank</option>
                                        <option value="TCB">Techcombank</option>
                                        <option value="BIDV">BIDV</option>
                                        <option value="MB">MB Bank</option>
                                        <option value="ACB">ACB</option>
                                        <option value="VPB">VPBank</option>
                                    </select>
                                </div>

                                <div className="bankHint">
                                    You will be redirected to your bank gateway to complete payment.
                                </div>
                            </div>
                        )}

                        {method === "transfer" && (
                            <div className="payForm">
                                <div className="transferBox">
                                    <div className="transferTitle">Bank transfer information</div>

                                    <div className="transferRow">
                                        <span>Account name</span>
                                        <b>MediConnect Co., Ltd</b>
                                    </div>
                                    <div className="transferRow">
                                        <span>Account number</span>
                                        <b>0123 456 789</b>
                                    </div>
                                    <div className="transferRow">
                                        <span>Bank</span>
                                        <b>Vietcombank</b>
                                    </div>
                                    <div className="transferRow">
                                        <span>Transfer content</span>
                                        <b>MC-DEPOSIT-{apptInfo.id}</b>
                                    </div>

                                    <div className="transferNote">
                                        * Sau khi chuyển khoản, hệ thống sẽ xác nhận.
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            className="btn_pay"
                            disabled={
                                loadingPay ||
                                depositPaid ||
                                (method === "card" && !isCardFormValid) ||
                                depositAmount <= 0
                            }
                            onClick={handlePay}
                        >
                            {depositPaid
                                ? "Deposit already paid ✅"
                                : loadingPay
                                    ? "Processing..."
                                    : `Pay deposit ${formatMoney(depositAmount)}`}
                        </button>

                        <div className="text_span">
                            * Đây là tính năng demo: thanh toán đặt cọc để giữ chỗ, chống spam lịch.
                        </div>
                    </div>
                </section>

                {/* RIGHT: Summary */}
                <aside className="checkoutSummary">
                    <div className="summaryCard">
                        <div className="summaryTitle">Appointment summary</div>

                        <div className="summaryItem">
                            <span>Appointment ID</span>
                            <b>#{apptInfo.id}</b>
                        </div>

                        <div className="summaryItem">
                            <span>Code</span>
                            <b>{apptInfo.appointment_code || "-"}</b>
                        </div>

                        <div className="summaryItem">
                            <span>Doctor</span>
                            <b>{apptInfo.doctorName}</b>
                        </div>

                        <div className="summaryItem">
                            <span>Specialty</span>
                            <b>{apptInfo.specialty}</b>
                        </div>

                        <div className="summaryItem">
                            <span>Date</span>
                            <b>{apptInfo.date}</b>
                        </div>

                        <div className="summaryItem">
                            <span>Time</span>
                            <b>{apptInfo.time}</b>
                        </div>

                        <div className="summaryItem">
                            <span>Clinic</span>
                            <b>{apptInfo.branch}</b>
                        </div>

                        <hr className="separator soft" />

                        <div className="summaryPrice">
                            <span>Deposit now</span>
                            <b>{formatMoney(depositAmount)}</b>
                        </div>

                        <div className="summarySecure">
                            ✅ Deposit giữ slot <br />
                            ✅ Chống spam lịch <br />
                            ✅ Support 24/7
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
