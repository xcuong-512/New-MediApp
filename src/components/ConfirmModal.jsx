import "../styles/modal.css";

export default function ConfirmModal({
    open,
    title = "Confirm",
    description = "",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onCancel,
    onConfirm,
    loading = false,
}) {
    if (!open) return null;

    return (
        <div className="modalOverlay" onClick={onCancel}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal__head">
                    <div className="modal__title">{title}</div>
                    <button className="modal__x" onClick={onCancel}>
                        ✕
                    </button>
                </div>

                {description ? <div className="modal__desc">{description}</div> : null}

                <div className="modal__actions">
                    <button className="btnLight" onClick={onCancel} disabled={loading}>
                        {cancelText}
                    </button>
                    <button className="btnPrimary" onClick={onConfirm} disabled={loading}>
                        {loading ? "Processing..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
