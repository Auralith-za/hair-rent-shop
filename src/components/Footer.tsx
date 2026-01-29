import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.row}>
                    {/* Column 1: Hair Rentals */}
                    <div className={styles.column}>
                        <h4 className={styles.heading}>Hair Rentals</h4>
                        <div className={styles.text}>
                            <p>Copyright © Hair Rentals All Rights Reserved</p>
                        </div>
                    </div>

                    {/* Column 2: Important Info */}
                    <div className={styles.column}>
                        <h4 className={styles.heading}>Important Info</h4>
                        <div className={styles.linkList}>
                            <a href="https://hair-rent.co.za/about/" className={styles.link}>About</a>
                            <a href="https://hair-rent.co.za/faq/" className={styles.link}>FAQ</a>
                        </div>
                    </div>

                    {/* Column 3: Our Hair */}
                    <div className={styles.column}>
                        <h4 className={styles.heading}>Our Hair</h4>
                        <div className={styles.linkList}>
                            <a href="https://hair-rent.co.za/our-hair/#carousel_ef91" className={styles.link}>Our Hair</a>
                            <a href="https://hair-rent.co.za/gallery/" className={styles.link}>Gallery</a>
                        </div>
                    </div>

                    {/* Column 4: Quick Links */}
                    <div className={styles.column}>
                        <h4 className={styles.heading}>Quick Links</h4>
                        <div className={styles.linkList}>
                            <a href="https://hair-rent.co.za/partnership-program/" className={styles.link}>Buy Hair</a>
                            <a href="https://hair-rent.co.za/contact-us/" className={styles.link}>Contact Us</a>
                        </div>
                    </div>
                </div>

                {/* Social Icons */}
                <div className={styles.socialRow}>
                    <a href="https://www.facebook.com/hair.rent" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </a>
                    <a href="https://www.tiktok.com/@hair_rent" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v4a9 9 0 0 1-9-9v8z"></path></svg>
                    </a>
                    <a href="https://www.instagram.com/hair_rent/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    </a>
                </div>
            </div>
        </footer>
    );
}
