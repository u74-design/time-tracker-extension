export default function StatCards({ topSites, totalMsToday, formatTime }) {
  // Most visited site today
  const topSite = topSites[0]?.site || "None yet";

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: "16px",
      marginBottom: "24px"
    }}>

      {/* Card 1 — Total time */}
      <div style={cardStyle}>
        <p style={labelStyle}>Total time today</p>
        <p style={valueStyle}>{formatTime(totalMsToday) || "0s"}</p>
      </div>

      {/* Card 2 — Sites visited */}
      <div style={cardStyle}>
        <p style={labelStyle}>Sites visited</p>
        <p style={valueStyle}>{topSites.length}</p>
      </div>

      {/* Card 3 — Most visited */}
      <div style={cardStyle}>
        <p style={labelStyle}>Most visited</p>
        <p style={{ ...valueStyle, fontSize: "16px", color: "#6c63ff" }}>
          {topSite}
        </p>
      </div>

      {/* Card 4 — Time on top site */}
      <div style={cardStyle}>
        <p style={labelStyle}>Top site time</p>
        <p style={{ ...valueStyle, color: "#1D9E75" }}>
          {topSites[0] ? formatTime(topSites[0].ms) : "0s"}
        </p>
      </div>

    </div>
  );
}

const cardStyle = {
  background: "#1a1a1a",
  border: "1px solid #2a2a2a",
  borderRadius: "12px",
  padding: "20px",
};

const labelStyle = {
  fontSize: "12px",
  color: "#888",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const valueStyle = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#ffffff"
};