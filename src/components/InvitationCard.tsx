import { useInvitation } from "./InvitationProvider";

/** Small inline glyphs — no icon font, no network request. */
function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 12"
      className={className}
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M2 6 H44 M76 6 H118"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path d="M60 1.5 L64.5 6 L60 10.5 L55.5 6 Z" fill="currentColor" opacity="0.85" />
      <circle cx="48.5" cy="6" r="1.6" fill="currentColor" opacity="0.6" />
      <circle cx="71.5" cy="6" r="1.6" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

function Corner({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={`absolute h-7 w-7 text-accent/45 ${className}`}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M1 14 V6 A5 5 0 0 1 6 1 H14"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M6 13 V8 A2 2 0 0 1 8 6 H13"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

function MetaRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center gap-1.5 leading-none">
      <span className="shrink-0 text-accent-deep">{icon}</span>
      <span className="font-cairo text-[7.5px] font-semibold tracking-wide text-onpaper-soft">
        {children}
      </span>
    </div>
  );
}

export default function InvitationCard() {
  const { hosts, event, body, date, time, venue, brand } = useInvitation();

  return (
    <article className="paper-card relative flex h-full w-full flex-col items-center justify-between overflow-hidden rounded-[7px] px-3 py-[9px] text-onpaper">
      <Corner className="top-[6px] right-[6px]" />
      <Corner className="bottom-[6px] right-[6px] rotate-90" />
      <Corner className="bottom-[6px] left-[6px] rotate-180" />
      <Corner className="top-[6px] left-[6px] -rotate-90" />

      {/* ① Invocation */}
      <p className="font-amiri text-[7.5px] leading-none font-bold text-accent-deep/85">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>

      {/* ② Hosts + event type */}
      <div className="flex flex-col items-center gap-[3px]">
        <h2
          className="font-amiri text-[clamp(14px,4.3vw,20px)] leading-tight font-bold"
          lang="ar"
        >
          {hosts.ar}
        </h2>
        <p className="font-script text-[clamp(11px,3.2vw,15px)] leading-none text-accent-deep">
          {event.en}
        </p>
        <Ornament className="h-[9px] w-[86px] text-accent" />
      </div>

      {/* ③ Body copy */}
      <p
        className="line-clamp-3 text-center font-cairo text-[7.5px] leading-[1.65] text-onpaper-soft"
        lang="ar"
      >
        {body.ar}
      </p>

      {/* ④ Date · time · venue */}
      <div className="flex flex-col items-center gap-[3px]">
        <MetaRow
          icon={
            <svg viewBox="0 0 12 12" className="h-[9px] w-[9px]" fill="currentColor">
              <path d="M6 0a6 6 0 1 0 0 12A6 6 0 0 0 6 0Zm0 1.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Z" />
              <path d="M5.2 2.6h1.6v3.9l2.6 1.5-.8 1.4-3.4-2V2.6Z" />
            </svg>
          }
        >
          <time dateTime={date.iso}>{date.ar}</time>
        </MetaRow>
        <MetaRow
          icon={
            <svg viewBox="0 0 12 12" className="h-[9px] w-[9px]" fill="currentColor">
              <path d="M6 0C3.8 0 2 1.8 2 4c0 2.8 4 8 4 8s4-5.2 4-8c0-2.2-1.8-4-4-4Zm0 5.6A1.6 1.6 0 1 1 6 2.4a1.6 1.6 0 0 1 0 3.2Z" />
            </svg>
          }
        >
          {venue.ar} · {time.ar}
        </MetaRow>
      </div>

      {/* ⑤ Footer signature */}
      <div className="flex flex-col items-center gap-[1px]">
        <div className="h-px w-10 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        <p className="font-script text-[clamp(9px,2.6vw,12px)] leading-none text-accent-deep">
          {brand.en}
        </p>
      </div>
    </article>
  );
}