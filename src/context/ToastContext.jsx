import { createContext, useContext, useState } from "react";
import "../styles/toast.css";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const remove = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const showToast = (message, type = "info", duration = 3000) => {
        const id = Date.now() + Math.random();
        const toast = { id, message, type };

        setToasts((prev) => [toast, ...prev]);

        if (duration > 0) {
            setTimeout(() => remove(id), duration);
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="toastWrap">
                {toasts.map((t) => (
                    <div key={t.id} className={`toast toast--${t.type}`}>
                        <div className="toast__icon">
                            {t.type === "success" ? "✅" : t.type === "error" ? "⛔" : "ℹ️"}
                        </div>

                        <div className="toast__content">
                            <div className="toast__title">
                                {t.type === "success"
                                    ? "Success"
                                    : t.type === "error"
                                        ? "Error"
                                        : "Info"}
                            </div>
                            <div className="toast__msg">{t.message}</div>
                        </div>

                        <button className="toast__close" onClick={() => remove(t.id)}>
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
