import { useState, useEffect } from "react";
import axios from 'axios';

const API_URL = "http://localhost:5000/api";

export function useTimeData() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/summary`);
            setData(res.data.data || []);
            setError(null);
        } catch (err) {
            setError("Could not connect to server.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const todayData = data.filter(
        (log) => log.date === new Date().toLocaleDateString()
    )

    const totalMsToday = todayData.reduce((sum, log) => sum + log.ms, 0);

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) return `${hours}h ${minutes}m`;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
    }

    const topSites = [...todayData].sort((a, b) => b.ms - a.ms);

    return {
        data,
        todayData,
        topSites,
        totalMsToday,
        formatTime,
        loading,
        error,
        refetch: fetchData
    };
}

