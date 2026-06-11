export default function SiteTable({ data, formatTime }) {
  // ✅ Fixed — (data || []) protects against undefined
  const sorted = [...(data || [])].sort((a, b) => b.ms - a.ms);
  const totalMs = (data || []).reduce((sum, log) => sum + log.ms, 0);

  if (sorted.length === 0) {
    return (
      <div style={containerStyle}>
        <p style={titleStyle}>All sites</p>
        <p style={{ color: "#555", textAlign: "center", padding: "40px 0" }}>
          No data yet!
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <p style={titleStyle}>All sites</p>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Site", "Date", "Time Spent", "% of Total"].map((h) => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((log, i) => {
            const percent = totalMs > 0
              ? ((log.ms / totalMs) * 100).toFixed(1)
              : 0;

            return (
              <tr key={i} style={{ borderBottom: "1px solid #1e1e1e" }}>
                <td style={tdStyle}>
                  <span style={{ color: "#6c63ff", fontWeight: "500" }}>
                    {log.site}
                  </span>
                </td>
                <td style={{ ...tdStyle, color: "#888" }}>{log.date}</td>
                <td style={tdStyle}>{formatTime(log.ms)}</td>
                <td style={tdStyle}>
                  <span style={{
                    color: percent > 30 ? "#1D9E75" : "#888",
                    fontWeight: percent > 30 ? "600" : "400"
                  }}>
                    {percent}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const containerStyle = {
  background: "#1a1a1a",
  border: "1px solid #2a2a2a",
  borderRadius: "12px",
  padding: "20px",
  marginBottom: "24px"
};

const titleStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#ffffff",
  marginBottom: "16px"
};

const thStyle = {
  textAlign: "left",
  fontSize: "11px",
  color: "#555",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  paddingBottom: "12px",
  borderBottom: "1px solid #2a2a2a"
};

const tdStyle = {
  padding: "12px 0",
  fontSize: "13px",
  color: "#e0e0e0"
};