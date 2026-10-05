"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { InvitationContent } from "@/lib/types";

/**
 * Every component below `InvitationExperience` used to import a
 * module-level `invitation` constant, which made a single design.
 * Passing the record through context means one component tree can
 * render any client's invitation.
 */
const InvitationContext = createContext<InvitationContent | null>(null);

export function InvitationProvider({
  content,
  children,
}: {
  content: InvitationContent;
  children: ReactNode;
}) {
  return (
    <InvitationContext.Provider value={content}>
      {children}
    </InvitationContext.Provider>
  );
}

export function useInvitation(): InvitationContent {
  const value = useContext(InvitationContext);
  if (!value) {
    throw new Error(
      "useInvitation() must be rendered inside <InvitationProvider>",
    );
  }
  return value;
}