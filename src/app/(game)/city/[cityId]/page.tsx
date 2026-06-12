"use client";

import { useParams } from "next/navigation";
import { CityView } from "@/features/cities/CityView";

export default function CityPage() {
  const params = useParams<{ cityId: string }>();
  return <CityView cityId={params.cityId} />;
}
