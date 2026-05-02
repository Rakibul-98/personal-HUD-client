/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, BarChart3, RefreshCw } from "lucide-react";
import api from "../../../lib/axios"; // Use shared instance with auth
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, Tooltip, Legend, Filler, ChartOptions,
} from "chart.js";
import { useTheme } from "../../../components/ThemeProvider/ThemeProvider";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler);

interface TrendData { keyword: string; data: { date: string; count: number }[] }
interface KeywordStats { keyword: string; totalOccurrences: number; averagePerDay: number; growthRate: number; peakCount: number }

const CHART_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];
const getColor = (i: number) => CHART_COLORS[i % CHART_COLORS.length];

const calcStats = (trends: TrendData[]): KeywordStats[] =>
  trends.map((trend) => {
    const counts = trend.data.map((d) => d.count);
    const total = counts.reduce((s, c) => s + c, 0);
    const first = trend.data[0]?.count ?? 0;
    const last = trend.data[trend.data.length - 1]?.count ?? 0;
    const growthRate = first > 0 ? Math.round(((last - first) / first) * 10000) / 100 : 0;
    return {
      keyword: trend.keyword,
      totalOccurrences: total,
      averagePerDay: Math.round((total / (trend.data.length || 1)) * 100) / 100,
      peakCount: Math.max(...counts, 0),
      growthRate,
    };
  });

export default function AnalyticsPage() {
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [stats, setStats] = useState<KeywordStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const { isDarkMode } = useTheme();

  const fetchData = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError("");
    try {
      // Fixed: response shape is { success, data: [...] }
      const { data } = await api.get("/analytics/keyword-trends");
      const items: TrendData[] = data.data ?? [];
      setTrends(items);
      setStats(calcStats(items));
    } catch {
      setError("Failed to load analytics. Make sure you are logged in.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const gridColor = isDarkMode ? "#374151" : "#e5e7eb";
  const tickColor = isDarkMode ? "#9ca3af" : "#4b5563";
  const textColor = isDarkMode ? "#fff" : "#111";

  const baseOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { labels: { color: textColor, boxWidth: 16, padding: 14, font: { size: 12 } } },
      tooltip: {
        backgroundColor: isDarkMode ? "#1f2937" : "#fff",
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: { ticks: { color: tickColor, maxRotation: 45 }, grid: { color: gridColor } },
      y: { ticks: { color: tickColor, precision: 0 }, grid: { color: gridColor }, beginAtZero: true },
    },
  };

  const allDates = [...new Set(trends.flatMap((t) => t.data.map((d) => d.date)))].sort();

  const lineData = {
    labels: allDates,
    datasets: trends.map((t, i) => {
      const map = new Map(t.data.map((d) => [d.date, d.count]));
      const color = getColor(i);
      return {
        label: t.keyword,
        data: allDates.map((d) => map.get(d) ?? 0),
        borderColor: color,
        backgroundColor: `${color}20`,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        borderWidth: 2,
        pointBackgroundColor: color,
      };
    }),
  };

  const barData = {
    labels: stats.map((s) => s.keyword),
    datasets: [{
      label: "Total Occurrences",
      data: stats.map((s) => s.totalOccurrences),
      backgroundColor: stats.map((_, i) => `${getColor(i)}CC`),
      borderColor: stats.map((_, i) => getColor(i)),
      borderWidth: 2,
      borderRadius: 6,
    }],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-400">Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-sm text-gray-400">{error}</p>
        <button onClick={() => fetchData()} className="text-sm text-blue-500 hover:underline">Retry</button>
      </div>
    );
  }

  if (trends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 px-4 text-center">
        <div className={`rounded-full p-5 ${isDarkMode ? "bg-white/10" : "bg-gray-100"}`}>
          <BarChart3 className="w-12 h-12 text-gray-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">No Analytics Data Yet</h2>
          <p className="text-sm text-gray-400 max-w-sm">
            Your keyword trends will appear here as you add focus topics and interact with your feed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto px-4 md:px-6 py-4 space-y-6">
      <Tabs defaultValue="comparison">
        <div className="flex justify-between items-center mb-4">
          <TabsList className={isDarkMode ? "bg-white/5" : "bg-gray-100"}>
            <TabsTrigger value="comparison"><BarChart3 className="w-4 h-4 mr-1.5" />Comparison</TabsTrigger>
            <TabsTrigger value="trends"><TrendingUp className="w-4 h-4 mr-1.5" />Over Time</TabsTrigger>
          </TabsList>
          <Button
            onClick={() => fetchData(true)}
            variant="outline"
            size="sm"
            className={`cursor-pointer gap-1.5 ${isDarkMode && "border-gray-600 text-gray-300 hover:bg-white/5"}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>

        <TabsContent value="trends">
          <div className={`p-4 rounded-lg ${isDarkMode ? "bg-white/5" : "bg-gray-50"}`}>
            <div className="h-72">
              <Line data={lineData} options={baseOptions} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comparison">
          <div className={`p-4 rounded-lg ${isDarkMode ? "bg-white/5" : "bg-gray-50"}`}>
            <div className="h-72">
              <Bar data={barData} options={{ ...(baseOptions as any), plugins: { ...baseOptions.plugins, legend: { display: false } } }} />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Stats table */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" /> Keyword Summary
        </p>
        {stats.map((stat, i) => (
          <div
            key={stat.keyword}
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg transition-colors ${isDarkMode ? "bg-white/5 hover:bg-white/8" : "bg-gray-50 hover:bg-gray-100"
              }`}
          >
            <div className="flex items-center gap-3 mb-2 sm:mb-0">
              <div className="w-2.5 h-6 rounded-full" style={{ backgroundColor: getColor(i) }} />
              <span className="font-medium capitalize">{stat.keyword}</span>
              <Badge variant={stat.growthRate >= 0 ? "default" : "destructive"} className="text-xs">
                {stat.growthRate >= 0 ? "↑" : "↓"} {Math.abs(stat.growthRate)}%
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-6 text-center">
              {[
                { label: "Total", value: stat.totalOccurrences },
                { label: "Avg/Day", value: stat.averagePerDay },
                { label: "Peak", value: stat.peakCount },
                { label: "Growth", value: `${stat.growthRate >= 0 ? "+" : ""}${stat.growthRate}%`, color: stat.growthRate >= 0 ? "text-green-500" : "text-red-500" },
              ].map(({ label, value, color }) => (
                <div key={label}>
                  <p className={`text-lg font-bold leading-tight ${color ?? ""}`}>{value}</p>
                  <p className="text-[11px] text-gray-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
