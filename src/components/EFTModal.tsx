"use client";

import { useEffect } from "react";
import styles from "./EFTModal.module.css";

interface EFTModalProps {
    orderNumber: string;
    onClose: () => void;
}

export default function EFTModal({ orderNumber, onClose }: EFTModalProps) {
    useEffect(() => {
        // Auto-close after 5 seconds
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.iconWrapper}>
                    <svg className={styles.checkIcon} viewBox="0 0 52 52">
                        <circle className={styles.checkCircle} cx="26" cy="26" r="25" fill="none" />
                        <path className={styles.checkPath} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                    </svg>
                </div>

                <h2 className={styles.title}>Order Request Sent!</h2>

                <div className={styles.content}>
                    <p className={styles.message}>
                        Thank you for your order request! We've received your inquiry and will review it shortly.
                    </p>

                    <div className={styles.orderInfo}>
                        <p className={styles.orderNumber}>
                            Order Number: <strong>#{orderNumber}</strong>
                        </p>
                    </div>

                    <div className={styles.instructions}>
                        <p>What happens next:</p>
                        <ul>
                            <li>We'll check availability of your requested items</li>
                            <li>You'll receive an email confirmation shortly</li>
                            <li>Once approved, we'll send payment details</li>
                        </ul>
                    </div>

                    <p className={styles.note}>
                        This usually takes a few hours during business hours. We'll be in touch soon!
                    </p>
                </div>

                <button onClick={onClose} className={styles.closeButton}>
                    Close
                </button>
            </div>
        </div>
    );
}
