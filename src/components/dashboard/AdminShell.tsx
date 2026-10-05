import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Admin chrome. Uses the `royal` palette so the dashboard has a
 * stable identity, independent of whichever theme a guest card uses.
 */
export default function AdminShell({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      dir="ltr"
      data-theme="royal"
      className="theme-canvas min-h-[100dvh] bg-bg-deep text-paper"
    >
      <div className="mx-auto w-full max-w-3xl px-5 pt-[max(22px,env(safe-area-inset-top))] pb-[max(40px,env(safe-area-inset-bottom))]">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              href="/"
              className="font-script text-[19px] leading-none text-accent/80"
            >
              MomoCards
            </Link>
            <h1 className="mt-1.5 text-[22px] leading-tight font-bold">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-[12.5px] text-paper/45">{subtitle}</p>
            )}
          </div>
          {action}
        </header>

        {children}
      </div>
    </div>
  );
}