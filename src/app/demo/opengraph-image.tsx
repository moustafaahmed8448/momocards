import { invitationOg } from "@/lib/og";
import { SAMPLE } from "@/lib/invitation";

export const alt = `${SAMPLE.hosts.en} — ${SAMPLE.event.en} invitation`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return invitationOg(SAMPLE, "royal");
}