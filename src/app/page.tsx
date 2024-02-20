import styles from "./page.module.css";
import "@bryntum/gantt/gantt.stockholm.css";

import { GanttWrapper } from "@/components/GanttWrapper";

export default function Home() {
  return (
    <main className={styles.main}>
      <GanttWrapper />
    </main>
  );
}
