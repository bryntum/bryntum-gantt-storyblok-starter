"use client";

import { BryntumGantt } from "@bryntum/gantt-react";
import { useEffect, useRef } from "react";
export default function Gantt({ ...props }) {
  const ganttRef = useRef<BryntumGantt>(null);

  useEffect(() => {
    // Bryntum Gantt instance
    const gantt = ganttRef?.current?.instance;
  }, []);

  return <BryntumGantt {...props} ref={ganttRef} />;
}
