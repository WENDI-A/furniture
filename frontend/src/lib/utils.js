import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getApiBaseUrl() {
  const envUrl = import.meta?.env?.VITE_API_URL;
  return (typeof envUrl === "string" && envUrl.length > 0)
    ? envUrl.replace(/\/$/, "")
    : "http://localhost:5000";
}

export function getImageUrl(fileName) {
  if (!fileName) return `${getApiBaseUrl()}/images/react.svg`;
  return `${getApiBaseUrl()}/images/${fileName}`;
}