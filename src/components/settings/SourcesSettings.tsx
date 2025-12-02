/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useCallback, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Swal from "sweetalert2";
import axios from "axios";
import { Loader2, Trash2 } from "lucide-react";
import { useTheme } from "../ThemeProvider/ThemeProvider";

interface RssSource {
  _id: string;
  name: string;
  url: string;
  isActive: boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function SourcesSettings() {
  const [sources, setSources] = useState<RssSource[]>([]);
  const [newName, setNewName] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useTheme();

  const fetchSources = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/sources`, {
        withCredentials: true,
      });
      setSources(response.data);
    } catch (error) {
      console.log("Error loading data!");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const handleAddSource = async () => {
    if (!newName || !newUrl) {
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Both name and URL are required.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/sources`,
        { name: newName, url: newUrl },
        { withCredentials: true }
      );

      setSources([...sources, response.data]);
      setNewName("");
      setNewUrl("");

      Swal.fire({
        icon: "success",
        title: "Success",
        text: `Source "${newName}" added successfully.`,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not add the RSS source. URL may be invalid or already exists.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (source: RssSource) => {
    try {
      const updatedSource = { ...source, isActive: !source.isActive };

      await axios.put(`${API_BASE_URL}/sources/${source._id}`, updatedSource, {
        withCredentials: true,
      });

      setSources(
        sources.map((s) => (s._id === source._id ? updatedSource : s))
      );

      Swal.fire({
        icon: "success",
        title: "Updated",
        text: `Source "${source.name}" is now ${
          updatedSource.isActive ? "active" : "inactive"
        }.`,
      });
    } catch (error) {
      console.log("Error update data!");
    }
  };

  const handleDeleteSource = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: `Delete "${name}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#666",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE_URL}/sources/${id}`, {
        withCredentials: true,
      });
      setSources(sources.filter((s) => s._id !== id));

      Swal.fire({
        icon: "success",
        title: "Deleted",
        text: `Source "${name}" has been removed.`,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Could not delete the RSS source.",
      });
    }
  };

  return (
    <div
      className={`h-full overflow-auto ${
        isDarkMode ? "bg-white/5" : "bg-gray-500/20"
      } backdrop-blur p-5`}
    >
      <h3 className="text-xl font-semibold">RSS Source Management</h3>
      <p className="opacity-70 font-light">
        Add, remove, and manage your personal news feeds.
      </p>

      <div>
        {/* Add New Source */}
        <div className="space-y-3 p-4 bg-black/20 my-5 rounded-md">
          <h3 className="text-lg font-semibold">Add New Source</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source-name">Source Name</Label>
              <input
                className={`${
                  isDarkMode
                    ? "bg-gray-100/10 border-gray-100/50"
                    : "border-gray-500 bg-gray-100/50"
                } border  focus:outline-0 p-2 w-full placeholder-gray-500`}
                id="source-name"
                placeholder="e.g., TechCrunch"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="source-url">RSS Feed URL</Label>
              <input
                className={`${
                  isDarkMode
                    ? "bg-gray-100/10 border-gray-100/50"
                    : "border-gray-500 bg-gray-100/50"
                } border  focus:outline-0 p-2 w-full placeholder-gray-500`}
                id="source-url"
                placeholder="e.g., https://techcrunch.com/feed/"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
              />
            </div>
          </div>

          <button
            className="bg-gradient-to-r from-blue-500 to-purple-600 
    px-5 py-1.5
    text-white
    shadow-lg shadow-blue-500/30
    active:scale-[0.98]
    transition-all 
    duration-200
    disabled:opacity-70 disabled:cursor-auto cursor-pointer"
            onClick={handleAddSource}
            disabled={isLoading || !newName || !newUrl}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 />
                Adding...
              </span>
            ) : (
              "Add Source"
            )}
          </button>
        </div>

        {/* List Sources */}
        <h3 className="text-lg font-semibold mb-2">
          Your Active Sources ({sources.length})
        </h3>

        {isLoading && sources.length === 0 ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : sources.length === 0 ? (
          <p className="opacity-70">
            You have no custom RSS sources added yet.
          </p>
        ) : (
          <div className={`space-y-2`}>
            {sources.map((source) => (
              <div
                key={source._id}
                className={`flex items-center justify-between px-3 py-1 ${
                  isDarkMode ? "bg-white/5" : "bg-gray-500/20"
                } backdrop-blur space-y-1`}
              >
                <div className="flex-1 min-w-0 mr-4">
                  <p className="font-medium truncate">{source.name}</p>
                  <p className="text-sm truncate">{source.url}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`status-${source._id}`}>Active</Label>
                    <Switch
                      id={`status-${source._id}`}
                      checked={source.isActive}
                      onCheckedChange={() => handleToggleActive(source)}
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteSource(source._id, source.name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
