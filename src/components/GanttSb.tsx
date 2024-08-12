import { storyblokEditable } from "@storyblok/react";
import { GanttStoryblok } from "../../component-types-sb";
import { GanttWrapper } from "./GanttWrapper";

const GanttSb = ({ blok }: { blok: GanttStoryblok }) => {
  return (
    <div {...storyblokEditable(blok)} style={{ flex: 1 }}>
      <GanttWrapper />
    </div>
  );
};

export default GanttSb;
