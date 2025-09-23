import React from "react";
import { Button } from "../../../ui/button";
import { Toggle } from "../../../ui/toggle";

export default function FeedMenu() {
  return (
    <div>
      <div className="flex justify-between gap-3 items-center">
        <div>
          <Toggle aria-label="Toggle auto scroll">Auto Scroll Toggle</Toggle>
        </div>
        <div>
          <Button variant="outline">Outline</Button>
        </div>
      </div>
    </div>
  );
}
