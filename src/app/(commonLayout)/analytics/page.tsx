/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, BarChart3, RefreshCw } from "lucide-react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from "chart.js";

import { HashLoader } from "react-spinners";
import { useTheme } from "../../../components/ThemeProvider/ThemeProvider";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface TrendData {
  keyword: string;
  data: { date: string; count: number }[];
}

interface KeywordStats {
  keyword: string;
  totalOccurrences: number;
  averagePerDay: number;
  growthRate: number;
  peakCount: number;
}

export default function AnalyticsPage() {
  const [keywordTrends, setKeywordTrends] = useState<TrendData[]>([]);
  const [keywordStats, setKeywordStats] = useState<KeywordStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("comparison");
  const { isDarkMode } = useTheme();

  const calculateStats = useCallback((trends: TrendData[]): KeywordStats[] => {
    return trends.map((trend) => {
      const counts = trend.data.map((d) => d.count);
      const totalOccurrences = counts.reduce((sum, count) => sum + count, 0);
      const averagePerDay = totalOccurrences / trend.data.length || 0;
      const peakCount = Math.max(...counts);

      let growthRate = 0;
      if (trend.data.length >= 2) {
        const first = trend.data[0].count;
        const last = trend.data[trend.data.length - 1].count;
        growthRate = ((last - first) / first) * 100;
      }

      return {
        keyword: trend.keyword,
        totalOccurrences,
        averagePerDay: Math.round(averagePerDay * 100) / 100,
        growthRate: Math.round(growthRate * 100) / 100,
        peakCount,
      };
    });
  }, []);

  const fetchData = useCallback(async () => {
    setRefreshing(true);
    try {
      const trendsResponse = await axios.get(
        `${API_BASE_URL}/analytics/keyword-trends`,
        { withCredentials: true }
      );
      const trends = trendsResponse.data;
      setKeywordTrends(trends);

      if (trends.length > 0) {
        const stats = calculateStats(trends);
        setKeywordStats(stats);
      }
    } catch (error) {
      console.error("Error fetching keyword trends:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData();
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
      <div
        className={`rounded-full p-6 mb-6 ${
          isDarkMode ? "bg-white/10" : "bg-gray-100"
        }`}
      >
        <BarChart3 className="w-16 h-16 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-3">No Analytics Data Yet</h2>
      <p
        className={`text-lg mb-6 max-w-md ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Your keyword trend analytics will appear here as you interact with the
        platform. Start exploring feeds to generate data.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mb-8">
        <div
          className={`p-4 rounded-lg ${
            isDarkMode ? "bg-white/5" : "bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`p-2 rounded ${
                isDarkMode ? "bg-blue-400/20" : "bg-blue-100"
              }`}
            >
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-semibold">Track Keywords</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Monitor how often your focus keywords appear in feeds
          </p>
        </div>
        <div
          className={`p-4 rounded-lg ${
            isDarkMode ? "bg-white/5" : "bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`p-2 rounded ${
                isDarkMode ? "bg-green-400/20" : "bg-green-100"
              }`}
            >
              <Calendar className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="font-semibold">Historical Data</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            View trends over time to identify patterns and growth
          </p>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full gap-6">
        <HashLoader color={isDarkMode ? "white" : "black"} size={50} />
        <div className="text-center">
          <p
            className={`text-lg font-medium mb-2 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Loading Analytics
          </p>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Gathering your keyword trend data...
          </p>
        </div>
      </div>
    );
  }

  if (keywordTrends.length === 0) {
    return <EmptyState />;
  }

  // Prepare chart data
  const trendLabels = Array.from(
    new Set(keywordTrends.flatMap((t) => t.data.map((d) => d.date)))
  ).sort();

  const getChartColor = (index: number) => {
    const colors = [
      "#3b82f6", // Blue
      "#10b981", // Green
      "#8b5cf6", // Purple
      "#f59e0b", // Amber
      "#ef4444", // Red
      "#06b6d4", // Cyan
    ];
    return colors[index % colors.length];
  };

  const trendChartData = {
    labels: trendLabels,
    datasets: keywordTrends.map((trend, index) => {
      const color = getChartColor(index);
      const dataMap = new Map(trend.data.map((d) => [d.date, d.count]));

      return {
        label: trend.keyword,
        data: trendLabels.map((date) => dataMap.get(date) ?? 0),
        borderColor: color,
        backgroundColor: `${color}20`,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 8,
        pointBackgroundColor: color,
        borderWidth: 3,
      };
    }),
  };

  const barChartData = {
    labels: keywordStats.map((stat) => stat.keyword),
    datasets: [
      {
        label: "Total Occurrences",
        data: keywordStats.map((stat) => stat.totalOccurrences),
        backgroundColor: keywordStats.map(
          (_, index) => `${getChartColor(index)}CC`
        ),
        borderColor: keywordStats.map((_, index) => getChartColor(index)),
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "nearest",
      intersect: false,
    },
    plugins: {
      legend: {
        labels: {
          color: isDarkMode ? "#fff" : "#111",
          boxWidth: 20,
          padding: 15,
          font: {
            size: 12,
            weight: "normal",
          },
        },
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: isDarkMode ? "#1f2937" : "#fff",
        titleColor: isDarkMode ? "#fff" : "#000",
        bodyColor: isDarkMode ? "#fff" : "#000",
        borderColor: isDarkMode ? "#374151" : "#e5e7eb",
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDarkMode ? "#9ca3af" : "#4b5563",
          maxRotation: 45,
        },
        grid: {
          color: isDarkMode ? "#374151" : "#e5e7eb",
        },
        title: {
          display: true,
          text: "Date",
          color: isDarkMode ? "#9ca3af" : "#6b7280",
          font: {
            size: 14,
            weight: "normal",
          },
        },
      },
      y: {
        ticks: {
          color: isDarkMode ? "#9ca3af" : "#4b5563",
          precision: 0,
        },
        grid: {
          color: isDarkMode ? "#374151" : "#e5e7eb",
        },
        title: {
          display: true,
          text: "Occurrences",
          color: isDarkMode ? "#9ca3af" : "#6b7280",
          font: {
            size: 14,
            weight: "normal",
          },
        },
        beginAtZero: true,
      },
    },
  };

  const barChartOptions: ChartOptions<"bar"> = {
    ...(chartOptions as any),
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="h-full overflow-auto px-4 md:px-6 space-y-6 pb-5">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <TabsList className={`${isDarkMode ? "bg-white/5" : "bg-gray-100"}`}>
            <TabsTrigger value="comparison" className="flex-1 md:flex-initial">
              <BarChart3 className="w-4 h-4 mr-2" />
              Keyword Comparison
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex-1 md:flex-initial">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trends Over Time
            </TabsTrigger>
          </TabsList>
          <Button
            onClick={handleRefresh}
            className={`${
              isDarkMode && "bg-secondary text-primary hover:text-secondary"
            } cursor-pointer`}
          >
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:block">Refresh Data</span>
          </Button>
        </div>

        <TabsContent value="trends" className="space-y-4">
          <div className={`${isDarkMode ? "bg-white/5" : "bg-gray-100"}`}>
            <div>
              <div className="h-[400px]">
                <Line data={trendChartData} options={chartOptions} />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <div className={`{isDarkMode ? "bg-white/5" : "bg-white"}`}>
            <div>
              <div className="h-[400px]">
                <Bar data={barChartData} options={barChartOptions} />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div>
        <div>
          <div className="space-y-3">
            {keywordStats.map((stat, index) => (
              <div
                key={stat.keyword}
                className={`flex flex-col md:flex-row md:items-center justify-between p-2 rounded-lg ${
                  isDarkMode
                    ? "bg-white/5 hover:bg-white/10"
                    : "bg-gray-50 hover:bg-gray-100"
                } transition-colors`}
              >
                <div className="flex items-center gap-4 mb-1 md:mb-0">
                  <div
                    className="w-3 h-7 rounded"
                    style={{ backgroundColor: getChartColor(index) }}
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-lg capitalize">
                        {stat.keyword}
                      </span>
                      <Badge
                        variant={
                          stat.growthRate >= 0 ? "default" : "destructive"
                        }
                      >
                        {stat.growthRate >= 0 ? "Growing" : "Declining"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {stat.totalOccurrences}
                    </p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stat.averagePerDay}</p>
                    <p className="text-xs text-muted-foreground">Avg/Day</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stat.peakCount}</p>
                    <p className="text-xs text-muted-foreground">Peak</p>
                  </div>
                  <div className="text-center">
                    <p
                      className={`text-2xl font-bold ${
                        stat.growthRate >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {stat.growthRate >= 0 ? "+" : ""}
                      {stat.growthRate}%
                    </p>
                    <p className="text-xs text-muted-foreground">Growth</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
