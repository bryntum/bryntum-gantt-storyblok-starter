"use client";
import { ReactNode } from "react";
import { apiPlugin, storyblokInit } from "@storyblok/react";
import Page from "./Page";
import Header from "./Header";
import GanttSb from "./GanttSb";

const components = {
  page: Page,
  header: Header,
  gantt: GanttSb,
};

storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_API_TOKEN,
  use: [apiPlugin],
  components,
});

export default function StoryblokProvider({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
