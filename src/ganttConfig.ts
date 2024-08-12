import { BryntumGanttProps } from "@bryntum/gantt-react";

const ganttConfig: BryntumGanttProps = {
  selectionMode: {
    multiSelect: false,
  },
  taskMenuFeature: {
    items: {
      // Hide item from the `edit` menu
      indent: false,
      outdent: false,
      // Hide item from the `add` submenu
      add: {
        menu: {
          subtask: false,
        },
      },
    },
  },
  columns: [{ type: "name", field: "name", width: 250 }],
  viewPreset: "weekAndDayLetter",
  barMargin: 10,
};
export { ganttConfig };
