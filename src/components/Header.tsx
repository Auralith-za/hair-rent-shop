import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";
import HeaderCart from "./HeaderCart";

export default function Header() {
    return (
        <header className={styles.header}>
            {/* Top Bar */}
            <div className={styles.topBar}>
                <div className={styles.topBarInner}>
                    <div className={styles.socialIcons}>
                        {/* Facebook */}
                        <a href="https://www.facebook.com/hair.rent" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                        </a>
                        {/* TikTok (Music Note representation) */}
                        <a href="https://www.tiktok.com/@hair_rent" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5v4a9 9 0 0 1-9-9v8z"></path></svg>
                        </a>
                        {/* Instagram */}
                        <a href="https://www.instagram.com/hair_rent/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                        </a>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
                        <a href="https://hair-rent.co.za/request-a-booking/" className={styles.bookBtn}>
                            BOOK NOW
                        </a>
                        <HeaderCart />
                    </div>
                </div>
            </div>

            {/* Main Navigation */}
            <div className={styles.mainBar}>
                <div className={styles.mainBarInner}>
                    <Link href="/">
                        <Image
                            src="/images/logo.png"
                            alt="Hair Rent"
                            width={180}
                            height={60}
                            className={styles.logo}
                            priority
                        />
                    </Link>

                    <nav className={styles.nav}>
                        <a href="https://hair-rent.co.za/" className={styles.navLink}>Home</a>
                        <a href="https://hair-rent.co.za/about/" className={styles.navLink}>About</a>
                        <a href="https://hair-rent.co.za/faq/" className={styles.navLink}>FAQ</a>
                        <a href="https://hair-rent.co.za/our-hair/" className={styles.navLink}>Our Hair</a>
                        <a href="https://hair-rent.co.za/gallery/" className={styles.navLink}>Gallery</a>
                        <a href="https://hair-rent.co.za/blogs/" className={styles.navLink}>Blogs</a>
                        <a href="https://hair-rent.co.za/contact-us/" className={styles.navLink}>Contact Us</a>
                    </nav>
                </div>
            </div>
        </header>
    );
}
