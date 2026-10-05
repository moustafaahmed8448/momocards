import type { Metadata } from "next";
import InvitationExperience from "@/components/InvitationExperience";
import { SAMPLE } from "@/lib/invitation";

export const metadata: Metadata = {
  title: "Demo",
  robots: { index: false, follow: false },
};

export default function DemoPage() {
  return <InvitationExperience content={SAMPLE} theme="royal" />;
}