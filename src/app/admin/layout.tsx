import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "sans-serif" }}>
            <aside style={{ width: "250px", background: "#f5f5f5", padding: "2rem", borderRight: "1px solid #ddd" }}>
                <h2 style={{ marginBottom: "2rem" }}>Admin Panel</h2>
                <nav>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        <li style={{ marginBottom: "1rem" }}>
                            <Link href="/admin" style={{ textDecoration: "none", color: "#333", fontWeight: "bold" }}>Dashboard</Link>
                        </li>
                        <li style={{ marginBottom: "1rem" }}>
                            <Link href="/" style={{ textDecoration: "none", color: "#666" }}>Back to Shop</Link>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main style={{ flex: 1, padding: "2rem", background: "#fff" }}>
                {children}
            </main>
        </div>
    );
}
