/**
 * Application configuration
 */

import { BryntumGanttProps } from "@bryntum/gantt-react";

const ganttConfig: BryntumGanttProps = {
  columns: [{ type: "name", field: "name", width: 250 }],
  viewPreset: "weekAndDayLetter",
  barMargin: 10,
  project: {
    transport: {
      load: {
        url: "data/data.json",
      },
    },
    autoLoad: true,
  },
};
export { ganttConfig };