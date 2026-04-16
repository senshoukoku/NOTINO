import { X, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

export default function Modal({ isOpen, onClose, title, message, type, onConfirm, confirmText = "Close" }) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Small delay ensures the component is mounted before the "active" classes are applied,
      // which triggers the CSS transition.
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // Match the duration-200 transition below
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`modal-overlay ${
        isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`modal-content ${isMobile ? 'modal-content-mobile' : ''} ${
          isAnimating ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-8"
        }`}
      >
        <button onClick={onClose} className="modal-close-btn">
          <X size={20} />
        </button>

        <div className="modal-header">
          {type === 'error' && (
            <div className="mb-4 text-yellow-400">
              <AlertTriangle size={48} strokeWidth={2.5} />
            </div>
          )}
          <h3 className="modal-title">{title}</h3>
        </div>

        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>

        <div className="modal-footer">
          <button
            onClick={() => {
              if (onConfirm) onConfirm();
              else onClose();
            }}
            className={`w-full py-3 mb-2 font-bold rounded-xl transition-all hover:scale-105 active:scale-95 ${type === 'error' ? 'btn-delete' : 'btn-action'}`}
          >
            {confirmText}
          </button>
          {onConfirm && (
            <button
              onClick={onClose}
              className="modal-cancel-btn"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}