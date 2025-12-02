/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface LogEventData {
  eventType: "BOOKMARK_SAVE" | "ARTICLE_VIEW" | "KEYWORD_FOCUS";
  targetId?: string;
  data?: Record<string, any>;
}

export const logAnalyticsEvent = async (eventData: LogEventData) => {
  try {
    // The backend handles user ID from the authenticated session
    await axios.post(`${API_BASE_URL}/analytics/log`, eventData, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Failed to log analytics event:", error);
    // Do not re-throw, as analytics logging should not block core functionality
  }
};
