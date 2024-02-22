import dynamic from "next/dynamic";
import { ganttConfig } from "../ganttConfig";

const Gantt = dynamic(() => import("./Gantt"), {
  ssr: false,
  loading: () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <p>Loading...</p>
      </div>
    );
  },
});

const GanttWrapper = () => {
  return <Gantt {...ganttConfig} />;
};
export { GanttWrapper };
