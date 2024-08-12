"use client";
import { ISbStoryData } from "@storyblok/react";
import { createContext, useState } from "react";
import { ISbComponentType } from "storyblok-js-client";

type Story = ISbStoryData<
  ISbComponentType<string> & {
    [index: string]: any;
  }
>;

export const StoryDataContext = createContext({
  storyData: {} as Story,
  setStoryData: (data: Story) => {},
});

export default function StoryDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [storyData, setStoryData] = useState<
    ISbStoryData<ISbComponentType<string> & { [index: string]: any }>
  >({} as Story);
  return (
    <StoryDataContext.Provider
      value={{
        storyData,
        setStoryData,
      }}
    >
      {children}
    </StoryDataContext.Provider>
  );
}
