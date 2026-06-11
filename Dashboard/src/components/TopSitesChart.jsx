import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const ms = payload[0].value;
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const time = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    return (
      <div style={{
        background: "#1a1a1a",
        border: "1px solid #333",
        borderRadius: "8px",
        padding: "10px 14px",
        fontSize: "13px"
      }}>
        <p style={{ color: "#888", marginBottom: "4px" }}>
          {payload[0].payload.site}
        </p>
        <p style={{ color: "#6c63ff", fontWeight: "600" }}>{time}</p>
      </div>
    );
  }
  return null;
}

export default function TopSitesChart({ topSites }) {
  // ✅ Fixed — (topSites || []) protects against undefined
  const chartData = (topSites || []).slice(0, 7).map((log) => ({
    site: log.site,
    ms: log.ms
  }));

  if (chartData.length === 0) {
    return (
      <div style={containerStyle}>
        <p style={titleStyle}>Top sites today</p>
        <p style={{ color: "#555", textAlign: "center", paddingTop: "60px" }}>
          No data yet. Browse something!
        </p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <p style={titleStyle}>Top sites today</p>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 30, left: 60, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#2a2a2a"
            horizontal={false}
          />
          <XAxis type="number" hide={true} />
          <YAxis
            type="category"
            dataKey="site"
            tick={{ fill: "#888", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#ffffff10" }} />
          <Bar
            dataKey="ms"
            fill="#6c63ff"
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
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
  marginBottom: "20px"
};