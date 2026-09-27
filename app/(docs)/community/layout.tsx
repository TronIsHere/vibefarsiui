import { notFound } from "next/navigation";
import { COMMUNITY_ENABLED } from "@/lib/site";

export default function Layout({ children }: { children: React.ReactNode }) {
  if (!COMMUNITY_ENABLED) notFound();
  return children;
}
