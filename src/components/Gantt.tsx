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
  });
  const ganttRef = useRef<BryntumGantt>(null);

  useEffect(() => {
    // Bryntum Gantt instance
    const gantt = ganttRef?.current?.instance;
  }, []);

  return <BryntumGantt {...props} ref={ganttRef} project={projectConfig} />;
}
