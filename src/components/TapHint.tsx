import type { Stage } from "@/lib/stage";

interface TapHintProps {
  stage: Stage;
}

export default function TapHint({ stage }: TapHintProps) {
  const isIdle = stage === "idle";

  return (
    <div
      className="mo-hint mb-1 flex flex-col items-center gap-2.5 text-center"
      aria-hidden={!isIdle}
    >
      <div className="relative flex h-10 w-10 items-center justify-center">
        {/* pulsing halo */}
        <span className="animate-halo absolute inset-0 rounded-full bg-accent/25 blur-lg" />
        <svg viewBox="0 0 24 24" className="relative h-6 w-6 text-accent-soft" fill="none">
          {/* tap / touch ripple */}
          <circle cx="12" cy="12" r="3.2" fill="currentColor" opacity="0.95" />
          <circle
            cx="12"
            cy="12"
            r="7"
            stroke="currentColor"
            strokeWidth="1.3"
            opacity="0.55"
          />
          <circle
            cx="12"
            cy="12"
            r="10.5"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.28"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-0.5">
        <p className="font-amiri text-[15px] leading-tight font-bold text-accent-soft sm:text-[17px]">
          اضغط لفتح الدعوة
        </p>
        <p className="font-cairo text-[10.5px] leading-tight font-medium tracking-[0.16em] text-accent/75 uppercase animate-shimmer">
          Tap to open your invitation
        </p>
      </div>
    </div>
  );
}