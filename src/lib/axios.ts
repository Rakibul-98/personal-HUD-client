// axios.ts
import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api"
    : undefined);

if (!baseURL) {
  throw new Error(
    "API URL is not defined. Set NEXT_PUBLIC_API_URL or run in dev mode."
  );
}

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
