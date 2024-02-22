"use client";

import { BryntumGantt } from "@bryntum/gantt-react";
import { useEffect, useRef, useState } from "react";

export default function Gantt({ ...props }) {
  const [projectConfig] = useState({
    transport: {
      load: {
        url: "data/data.json",
      },
    },
    autoLoad: true,
    // This config enables response validation and dumping of found errors to the browser console.
    // It's meant to be used as a development stage helper only so please set it to false for production.
    validateResponse: true,
  });
  const ganttRef = useRef<BryntumGantt>(null);

  useEffect(() => {
    // Bryntum Gantt instance
    const gantt = ganttRef?.current?.instance;
  }, []);

  return <BryntumGantt {...props} ref={ganttRef} project={projectConfig} />;
}
