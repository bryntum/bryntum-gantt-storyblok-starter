"use client";
import { StoryDataContext } from "@/contexts/StoryData.context";
import { TaskModel } from "@bryntum/gantt";
import "@bryntum/gantt/gantt.stockholm.css";
import { StoryblokComponent, useStoryblok } from "@storyblok/react";
import { useContext, useEffect } from "react";

export default function Home() {
  const story = useStoryblok("/home", { version: "draft" });
  const { setStoryData } = useContext(StoryDataContext);

  useEffect(() => {
    if (!story?.content) return;
    const currGanttComponentIndex: number = story.content?.body.findIndex(
      (item: any) => item.hasOwnProperty("tasks")
    );
    story.content.body[currGanttComponentIndex].tasks = story.content.body[
      currGanttComponentIndex
    ].tasks.map((task: TaskModel, index: number) => {
      const { _editable, ...rest } = task;
      return { ...rest, parentIndex: index };
    });
    setStoryData(story);
  }, [story, setStoryData]);

  if (!story || !story.content) {
    return <div>Loading...</div>;
  }

  return <StoryblokComponent blok={story.content} />;
}
