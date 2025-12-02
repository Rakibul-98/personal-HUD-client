"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "axios";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { HashLoader } from "react-spinners";
import { useTheme } from "../../../components/ThemeProvider/ThemeProvider";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface TrendData {
  keyword: string;
  data: { date: string; count: number }[];
}

export default function AnalyticsPage() {
  const [keywordTrends, setKeywordTrends] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useTheme();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const trendsResponse = await axios.get(
        `${API_BASE_URL}/analytics/keyword-trends`,
        { withCredentials: true }
      );
      setKeywordTrends(trendsResponse.data);
    } catch (error) {
      console.error("Error fetching keyword trends:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const trendLabels: string[] = Array.from(
    new Set(keywordTrends.flatMap((t) => t.data.map((d) => d.date)))
  ).sort();

  const trendDatasets = keywordTrends.map((trend, index) => {
    const color = `hsl(${index * 60}, 70%, ${isDarkMode ? "60%" : "40%"})`;

    const dataMap = new Map<string, number>(
      trend.data.map((d) => [d.date, d.count])
    );

    return {
      label: trend.keyword,
      data: trendLabels.map((date: string) => dataMap.get(date) ?? 0),
      borderColor: color,
      backgroundColor: `${color}55`,
      fill: true,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6,
    };
  });

  const trendChartData = {
    labels: trendLabels,
    datasets: trendDatasets,
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: "nearest" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? "#fff" : "#111",
          boxWidth: 20,
          padding: 15,
        },
        position: "top" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: isDarkMode ? "#222" : "#fff",
        titleColor: isDarkMode ? "#fff" : "#000",
        bodyColor: isDarkMode ? "#fff" : "#000",
      },
      title: {
        display: true,
        text: "Keyword Trends Over Time",
        color: isDarkMode ? "#fff" : "#111",
        font: { size: 18 },
      },
    },
    scales: {
      x: {
        ticks: { color: isDarkMode ? "#ccc" : "#222" },
        grid: { color: isDarkMode ? "#333" : "#ddd" },
        title: {
          display: true,
          text: "Date",
          color: isDarkMode ? "#aaa" : "#555",
        },
      },
      y: {
        ticks: { color: isDarkMode ? "#ccc" : "#222" },
        grid: { color: isDarkMode ? "#333" : "#ddd" },
        title: {
          display: true,
          text: "Occurrences",
          color: isDarkMode ? "#aaa" : "#555",
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <HashLoader color={isDarkMode ? "white" : "black"} size={50} />
      </div>
    );
  }

  return (
    <div className="px-4 h-full">
      {keywordTrends.length === 0 ? (
        <p className="text-muted-foreground">
          No keyword trend data recorded yet.
        </p>
      ) : (
        <Card
          className={`border-0 rounded-none shadow-lg backdrop-blur-md ${
            isDarkMode ? "bg-white/5" : "bg-gray-200/60"
          }`}
        >
          <CardHeader>
            <h3
              className={`text-xl font-semibold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Focus Keyword Trends
            </h3>
            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Interactive view of your focus keywords across time.
            </p>
          </CardHeader>

          <CardContent>
            <div className="h-[65vh]">
              <Line data={trendChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
