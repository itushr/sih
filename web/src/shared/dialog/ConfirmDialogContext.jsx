/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useRef, useState, useCallback } from "react";

const ConfirmContext = createContext(null);

export function ConfirmProvider({ children }) {
  const [config, setConfig] = useState(null);
  const resolveRef = useRef(null);
  const dialogRef = useRef(null);

  const confirm = useCallback(({
    title = "Confirm action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    tone = "standard",
  }) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setConfig({ title, message, confirmText, cancelText, tone });
      if (dialogRef.current) {
        dialogRef.current.showModal();
      }
    });
  }, []);

  const handleClose = useCallback((result) => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    if (resolveRef.current) {
      resolveRef.current(result);
      resolveRef.current = null;
    }
    setConfig(null);
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <dialog
        ref={dialogRef}
        className="gov-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="gov-dialog-title"
        aria-describedby="gov-dialog-desc"
        onCancel={(e) => {
          e.preventDefault();
          handleClose(false);
        }}
      >
        {config && (
          <div>
            <div className="gov-dialog-header">
              <span className={`gov-dialog-icon ${config.tone}`} aria-hidden="true">
                {config.tone === "danger" ? "!" : "i"}
              </span>
              <h3 id="gov-dialog-title">{config.title}</h3>
            </div>
            <p id="gov-dialog-desc" className="gov-dialog-body">
              {config.message}
            </p>
            <div className="gov-dialog-actions">
              <button
                type="button"
                className="outline-button"
                onClick={() => handleClose(false)}
              >
                {config.cancelText}
              </button>
              <button
                type="button"
                className={`solid-button compact ${config.tone === "danger" ? "danger" : ""}`}
                onClick={() => handleClose(true)}
                autoFocus
              >
                {config.confirmText}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return ctx.confirm;
}
