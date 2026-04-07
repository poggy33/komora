"use client";

import dynamic from "next/dynamic";

const PropertyLocationMap = dynamic(() => import("./PropertyLocationMap"), {
  ssr: false,
});

type Props = {
  coordinates: [number, number];
  title: string;
  address?: string;
};

export default function PropertyLocationMapWrapper(props: Props) {
  return <PropertyLocationMap {...props} />;
}