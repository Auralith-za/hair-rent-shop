export default function Loading() {
    return (
        <main style={{ padding: "40px 0", minHeight: "80vh" }}>
            <div className="container">
                {/* Loading skeleton for title */}
                <div style={{
                    height: "40px",
                    width: "300px",
                    background: "#f0f0f0",
                    margin: "0 auto 40px",
                    borderRadius: "4px",
                    animation: "pulse 1.5s ease-in-out infinite"
                }} />

                {/* Loading skeleton for product grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: "30px",
                    maxWidth: "1200px",
                    margin: "0 auto"
                }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{
                            height: "450px",
                            background: "#f0f0f0",
                            borderRadius: "8px",
                            animation: "pulse 1.5s ease-in-out infinite",
                            animationDelay: `${i * 0.1}s`
                        }} />
                    ))}
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
            `}</style>
        </main>
    );
}
