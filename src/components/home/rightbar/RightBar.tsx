"use client";

import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "../../ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export default function RightBar() {
  const availableSources = [
    { id: "reddit", label: "Reddit" },
    { id: "hackernews", label: "Hacker News" },
    { id: "devto", label: "Dev.to" },
  ];

  return (
    <div>
      <div>
        <div>
          <label>Select feed sources</label>
          <div className="">
            {availableSources.map((source) => (
              <div key={source.id} className="">
                <Checkbox id={source.id} />
                <label htmlFor={source.id} className="">
                  {source.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p>Scroll speed</p>
          <Slider defaultValue={[3]} max={5} step={1} />
        </div>
        <div>
          <p>Sorted by:</p>
          <Select defaultValue="latest">
            <SelectTrigger>
              <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="relevant">Most Relevant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
