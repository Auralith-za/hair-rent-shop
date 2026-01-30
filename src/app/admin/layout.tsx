'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
            });
            router.push('/admin/login');
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
            <aside style={{ width: "250px", background: "#f5f5f5", padding: "2rem", borderRight: "1px solid #ddd", display: "flex", flexDirection: "column" }}>
                <h2 style={{ marginBottom: "2rem" }}>Admin Panel</h2>
                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        <li style={{ marginBottom: "1rem" }}>
                            <Link href="/admin" style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}>Dashboard</Link>
                        </li>
                        <li style={{ marginBottom: "1rem" }}>
                            <Link href="/" style={{ textDecoration: "none", color: "#666" }}>Back to Shop</Link>
                        </li>
                    </ul>
                </nav>
                <button
                    onClick={handleLogout}
                    style={{
                        padding: "10px 20px",
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.9rem"
                    }}
                >
                    Logout
                </button>
            </aside>
            <main style={{ flex: 1, padding: "2rem", background: "#fff" }}>
                {children}
            </main>
        </div>
    );
}
