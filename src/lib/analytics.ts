import api from "./axios";

// Keep in sync with backend VALID_EVENT_TYPES
type EventType =
  | "BOOKMARK_SAVE"
  | "BOOKMARK_REMOVE"
  | "FEED_CLICK"
  | "KEYWORD_FOCUS"
  | "KEYWORD_REMOVE"
  | "FEED_REFRESH";

interface LogEventData {
  eventType: EventType;
  targetId?: string;
  data?: Record<string, unknown>;
}

/**
 * Fire-and-forget analytics event.
 * Never throws — analytics should never break core UX.
 */
export const logAnalyticsEvent = (eventData: LogEventData): void => {
  api.post("/analytics/log", eventData).catch(() => {
    // Silently ignore — analytics failures are non-critical
  });
};
