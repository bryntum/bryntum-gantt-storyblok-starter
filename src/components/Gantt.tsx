"use client";

import { StoryDataContext } from "@/contexts/StoryData.context";
import { BryntumGantt } from "@bryntum/gantt-react";
import { useContext, useEffect, useRef } from "react";
import { convertDateToSbFormat } from "@/helpers";
import { debounce } from "@/utils";
import { TaskModel } from "@bryntum/gantt";
import { ISbStoryData } from "@storyblok/react";
import { ISbComponentType } from "storyblok-js-client";

type SyncData = {
  action: "dataset" | "add" | "remove" | "update";
  records: {
    data: TaskModel;
    meta: {
      modified: Partial<TaskModel>;
    };
  }[];
  store: {
    id: "tasks";
  };
};

type Story = ISbStoryData<
  ISbComponentType<string> & {
    [index: string]: any;
  }
>;

export default function Gantt({ ...props }) {
  const { storyData, setStoryData } = useContext(StoryDataContext);
  const currGanttComponentIndex = storyData?.content?.body.findIndex(
    (item: any) => item.hasOwnProperty("tasks")
  );
  const ganttRef = useRef<BryntumGantt>(null);

  useEffect(() => {
    // Bryntum Gantt instance
    const gantt = ganttRef?.current?.instance;
  }, []);

  function updateStory(updatedStory: any) {
    // sort tasks by parentIndex then remove parentIndex
    const currGanttComponentIndex = storyData?.content?.body.findIndex(
      (item: any) => item.hasOwnProperty("tasks")
    );

    updatedStory.story.content.body[currGanttComponentIndex].tasks =
      updatedStory.story.content.body[currGanttComponentIndex].tasks
        .sort((a: TaskModel, b: TaskModel) => a.parentIndex - b.parentIndex)
        .map((task: TaskModel) => {
          const { parentIndex, _editable, ...rest } = task;
          return rest;
        });
    fetch("/api/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStory),
    })
      .then((response) => response.json())
      .then((data) => {
        const newGanttComponentIndex = data.story.content?.body.findIndex(
          (item: any) => item.hasOwnProperty("tasks")
        );

        if (
          JSON.stringify(
            updatedStory.story.content.body[currGanttComponentIndex].tasks
          ) !==
          JSON.stringify(data.story.content.body[newGanttComponentIndex].tasks)
        ) {
          data.story.content.body[newGanttComponentIndex].tasks =
            data.story.content.body[newGanttComponentIndex].tasks.map(
              (task: TaskModel, index: number) => {
                const { _editable, ...rest } = task;
                return { ...rest, parentIndex: index };
              }
            );
          setStoryData(JSON.parse(JSON.stringify(data.story)));
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  const debouncedFetch = debounce((updatedStory: Story) => {
    updateStory(updatedStory);
  }, 200);

  const syncData = async ({ store, action, records }: SyncData) => {
    const storeId = store.id;
    if (storeId === "tasks") {
      if (action === "add") {
        for (let i = 0; i < records.length; i++) {
          const storyDataState = JSON.parse(JSON.stringify(storyData));
          const content = storyDataState.content;
          const updatedContent = content.body.map((item: any) => {
            if (item.component === "gantt") {
              item.tasks = [
                ...item.tasks,
                {
                  id: crypto.randomUUID(),
                  _uid: crypto.randomUUID(),
                  name: (records[i].data as TaskModel).name,
                  startDate: convertDateToSbFormat(
                    `${(records[i].data as TaskModel).startDate}`
                  ),
                  endDate: convertDateToSbFormat(
                    `${(records[i].data as TaskModel).endDate}`
                  ),
                  component: "task",
                  percentDone: (records[i].data as TaskModel).percentDone,
                  manuallyScheduled: true,
                  effort: (records[i].data as TaskModel).effort,
                  parentIndex: records[i].data.parentIndex,
                  draggable: (records[i].data as TaskModel).draggable,
                  resizable: (records[i].data as TaskModel).resizable,
                },
              ];
            }
            return item;
          });
          const updatedStory = {
            story: {
              ...storyDataState,
              content: {
                ...storyData.content,
                body: updatedContent,
              },
            },
          };
          debouncedFetch(updatedStory);
        }
      }
      if (action === "remove") {
        for (let i = 0; i < records.length; i++) {
          const storyDataState = JSON.parse(JSON.stringify(storyData));
          const content = storyDataState.content;
          const updatedContent = content.body.map((item: any) => {
            if (item.component === "gantt") {
              item.tasks = item.tasks
                .map((task: TaskModel) => {
                  if (task.id === records[i].data.id) {
                    const dataToSend = {
                      id: records[i].data.id,
                      _uid: records[i].data._uid,
                      name: (records[i].data as TaskModel).name,
                      startDate: convertDateToSbFormat(
                        `${(records[i].data as TaskModel).startDate}`
                      ),
                      endDate: convertDateToSbFormat(
                        `${(records[i].data as TaskModel).endDate}`
                      ),
                      component: records[i].data.component,
                      percentDone: (records[i].data as TaskModel).percentDone,
                      manuallyScheduled: (records[i].data as TaskModel)
                        .manuallyScheduled,
                      effort: (records[i].data as TaskModel).effort,
                      parentIndex: records[i].data.parentIndex,
                      draggable: (records[i].data as TaskModel).draggable,
                      resizable: (records[i].data as TaskModel).resizable,
                    };
                    return dataToSend;
                  }
                  return task;
                })
                .filter((task: TaskModel) => task.id !== records[i].data.id);
            }
            return item;
          });
          const updatedStory = {
            story: {
              ...storyData,
              content: {
                ...storyData.content,
                body: updatedContent,
              },
            },
          };
          updateStory(updatedStory);
        }
      }
      if (action === "update") {
        const ganttTaskStoreData =
          ganttRef?.current?.instance?.taskStore.toJSON() as TaskModel[];

        for (let i = 0; i < records.length; i++) {
          const id = records[i].data.id;
          if (`${id}`.startsWith("_generated")) return;
          const storyDataState = JSON.parse(JSON.stringify(storyData));
          const content = storyDataState.content;
          const updatedContent = content.body.map((item: any) => {
            if (item.component === "gantt") {
              item.tasks = item.tasks.map((task: TaskModel) => {
                if (task.id === records[i].data.id) {
                  const dataToSend = {
                    id: records[i].data.id,
                    _uid: records[i].data._uid,
                    name: (records[i].data as TaskModel).name,
                    startDate: convertDateToSbFormat(
                      `${(records[i].data as TaskModel).startDate}`
                    ),
                    endDate: convertDateToSbFormat(
                      `${(records[i].data as TaskModel).endDate}`
                    ),
                    component: records[i].data.component,
                    percentDone: (records[i].data as TaskModel).percentDone,
                    manuallyScheduled: (records[i].data as TaskModel)
                      .manuallyScheduled,
                    effort: (records[i].data as TaskModel).effort,
                    parentIndex: records[i].data.parentIndex,
                    draggable: (records[i].data as TaskModel).draggable,
                    resizable: (records[i].data as TaskModel).resizable,
                  };
                  return dataToSend;
                }
                // add updated parentIndex values for other tasks - incase of reordering
                task.parentIndex = ganttTaskStoreData.filter(
                  (item: TaskModel) => item.id === task.id
                )[0].parentIndex;
                return task;
              });
            }
            return item;
          });
          const updatedStory = {
            story: {
              ...storyData,
              content: {
                ...storyData.content,
                body: updatedContent,
              },
            },
          };
          debouncedFetch(updatedStory);
        }
      }
    }
  };

  return (
    <BryntumGantt
      ref={ganttRef}
      tasks={storyData?.content?.body[currGanttComponentIndex].tasks}
      onDataChange={syncData}
      {...props}
    />
  );
}
