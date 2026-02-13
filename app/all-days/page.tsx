export default function AllDaysPage() {
  const links = [
    { day: "Day 1 - Rose Day", href: "/day-1" },
    { day: "Day 2 - Propose Day", href: "/day-2" },
    { day: "Day 3 - Chocolate Day", href: "/day-3" },
    { day: "Day 4 - Teddy Day", href: "/day-4" },
    { day: "Day 5 - Promise Day", href: "/day-5" },
    { day: "Day 6 - Hug Day", href: "/day-6" },
    { day: "Day 7 - Kiss Day", href: "/day-7" },
    { day: "Forever Valentine Monument", href: "/valentine" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#050915", color: "#f6f1ec", padding: "32px 18px" }}>
      <section style={{ maxWidth: 780, margin: "0 auto", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 18, padding: 20, background: "rgba(10,15,38,0.8)" }}>
        <h1 style={{ margin: "0 0 8px", fontSize: 32, lineHeight: 1.1 }}>Adil & Sana - Permanent Valentine Archive</h1>
        <p style={{ margin: "0 0 18px", opacity: 0.88 }}>
          Stable lifetime links from your main domain. Share these only, not random deployment hash URLs.
        </p>

        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                style={{
                  display: "block",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: "#f6f1ec",
                  textDecoration: "none",
                  background: "rgba(255,255,255,0.05)",
                  fontWeight: 600,
                }}
              >
                {link.day}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
