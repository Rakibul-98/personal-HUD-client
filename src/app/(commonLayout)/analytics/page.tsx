"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2"; // ← ADDED
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface TopicData {
  topic: string;
  count: number;
}

interface TrendData {
  keyword: string;
  data: { date: string; count: number }[];
}

export default function AnalyticsPage() {
  const [mostSavedTopics, setMostSavedTopics] = useState<TopicData[]>([]);
  const [keywordTrends, setKeywordTrends] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [topicsResponse, trendsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/analytics/most-saved-topics`, {
          withCredentials: true,
        }),
        axios.get(`${API_BASE_URL}/analytics/keyword-trends`, {
          withCredentials: true,
        }),
      ]);

      setMostSavedTopics(topicsResponse.data);
      setKeywordTrends(trendsResponse.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch analytics data.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const topicChartData = {
    labels: mostSavedTopics.map((t) => t.topic),
    datasets: [
      {
        label: "Times Bookmarked",
        data: mostSavedTopics.map((t) => t.count),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  // 1. Extract labels
  const trendLabels: string[] = Array.from(
    new Set(keywordTrends.flatMap((t) => t.data.map((d) => d.date)))
  ).sort();

  // 2. Build datasets
  const trendDatasets = keywordTrends.map((trend, index) => {
    const color = `hsl(${index * 50}, 70%, 50%)`;

    const dataMap = new Map<string, number>(
      trend.data.map((d) => [d.date, d.count])
    );

    return {
      label: trend.keyword,
      data: trendLabels.map((date: string) => dataMap.get(date) ?? 0),
      borderColor: color,
      backgroundColor: `${color}40`,
      fill: false,
      tension: 0.1,
    };
  });

  // 3. Combine labels + datasets
  const trendChartData = {
    labels: trendLabels,
    datasets: trendDatasets,
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 overflow-y-auto h-full">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Saved Topics</CardTitle>
            <CardDescription>
              Top 10 topics from your bookmarked articles.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mostSavedTopics.length > 0 ? (
              <div className="h-96">
                <Bar
                  data={topicChartData}
                  options={{
                    ...chartOptions,
                    indexAxis: "y" as const,
                  }}
                />
              </div>
            ) : (
              <p className="text-muted-foreground">
                No bookmarked articles with tags found.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Focus Keyword Trends</CardTitle>
            <CardDescription>
              Frequency of your focus keywords over time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {keywordTrends.length > 0 ? (
              <div className="h-96">
                <Bar data={trendChartData} options={chartOptions} />
              </div>
            ) : (
              <p className="text-muted-foreground">
                No focus keyword data logged yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
