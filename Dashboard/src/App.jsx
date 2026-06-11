import { useTimeData } from "./hooks/useTimeData";
import StatCards from "./components/StatCards";
import TopSitesChart from "./components/TopSitesChart";
import SiteTable from "./components/SiteTable";

export default function App() {
  const {
    data,
    topSites,
    totalMsToday,
    formatTime,
    loading,
    error,
    refetch
  } = useTimeData();

  return (
    <div style={{
      maxWidth: "900px",
      margin: "0 auto",
      padding: "32px 24px"
    }}>

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px"
      }}>
        <div>
          <h1 style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#ffffff"
          }}>
            ⏱ Time Tracker
          </h1>
          <p style={{ color: "#888", fontSize: "13px", marginTop: "4px" }}>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        </div>

        <button
          onClick={refetch}
          style={{
            background: "#6c63ff",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontSize: "13px",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <p style={{ color: "#888", textAlign: "center", padding: "60px 0" }}>
          Loading data...
        </p>
      )}

      {/* Error state */}
      {error && (
        <div style={{
          background: "#2a1a1a",
          border: "1px solid #5a2a2a",
          borderRadius: "12px",
          padding: "20px",
          color: "#ff6b6b",
          marginBottom: "24px",
          fontSize: "13px"
        }}>
          ⚠ {error}
        </div>
      )}

      {/* Dashboard */}
      {!loading && !error && (
        <>
          <StatCards
            topSites={topSites}
            totalMsToday={totalMsToday}
            formatTime={formatTime}
          />
          <TopSitesChart topSites={topSites} />
          <SiteTable data={data} formatTime={formatTime} />
        </>
      )}

    </div>
  );
}