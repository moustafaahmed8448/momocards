"use client";

import InvitationCard from "./InvitationCard";
import WaxSeal from "./WaxSeal";
import { useInvitation } from "./InvitationProvider";
import type { Stage } from "@/lib/stage";

/** Triangle: apex at the bottom-centre of the flap. */
const FLAP_CLIP = "polygon(0% 0%, 100% 0%, 50% 100%)";

interface EnvelopeProps {
  stage: Stage;
  onOpen: () => void;
}

/**
 * ─────────────────────────────────────────────────────────────
 *  PAINT-ORDER STACK
 *
 *  The card is hidden by *occlusion*, not by clipping — so it
 *  lives in a genuine 3D scene and can rise out naturally.
 *
 *    z 10 · back      (0%   → 100%)
 *    z 30 · CARD      (5%   →  81%)
 *    z 40 · pocket    (50%  → 100%)
 *    z 50 · flap      (0%   →  50%)
 *    z 60 · seal      (apex = 50%)
 *
 *  Closed: flap ∪ pocket = (0…50) ∪ (50…100) = the whole
 *  envelope ⇒ the card is mathematically invisible.
 *
 *  Open:   the card's bottom edge stops at 37.7%, above the
 *  pocket edge (50%), so it clears with a clean gap — no
 *  z-index swap required.
 * ─────────────────────────────────────────────────────────────
 */
export default function Envelope({ stage, onOpen }: EnvelopeProps) {
  const { hosts, brand } = useInvitation();
  const isIdle = stage === "idle";
  const isOpen = stage === "open";

  return (
    <div className="flex w-full flex-col items-center">
      {/* ── Headroom reserved for the opening flap + risen card ── */}
      <div className="w-full pt-[92px] sm:pt-[104px]">
        <div
          className={
            isIdle
              ? "relative mx-auto w-full cursor-pointer"
              : "relative mx-auto w-full"
          }
          style={{ perspective: 1400 }}
          role={isIdle ? "button" : "group"}
          tabIndex={isIdle ? 0 : -1}
          aria-label={isIdle ? "Open your invitation" : `${hosts.en} invitation`}
          onClick={isIdle ? onOpen : undefined}
          onKeyDown={(e) => {
            if (isIdle && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              onOpen();
            }
          }}
        >
          {/* contact shadow */}
          <div
            className="absolute -inset-x-4 bottom-[-26px] h-10 rounded-[50%] bg-black/65 blur-2xl"
            style={{ opacity: isOpen ? 0.45 : 0.7 }}
            aria-hidden="true"
          />

          <div className="mo-envelope relative mx-auto aspect-[1.48/1] w-full max-w-[330px] sm:max-w-[380px]">
            {/* ── ① Envelope back ───────────────────────────── */}
            <div
              className="absolute inset-0 rounded-[10px] bg-gradient-to-b from-paper-deep to-paper-shade"
              style={{ zIndex: 10 }}
              aria-hidden="true"
            />

            {/* ── ② Invitation card ────────────────────────── */}
            <div
              className="mo-card absolute top-[5%] right-[5%] left-[5%] h-[76%]"
              style={{ zIndex: 30 }}
            >
              <div className={isOpen ? "mo-card-float h-full w-full" : "h-full w-full"}>
                <InvitationCard />
              </div>
            </div>

            {/* ── ③ Front pocket ───────────────────────────── */}
            <div
              className="absolute inset-x-0 top-1/2 bottom-0 overflow-hidden rounded-b-[10px] bg-gradient-to-b from-paper via-paper to-paper-shade"
              style={{ zIndex: 40 }}
              aria-hidden="true"
            >
              {/* envelope creases */}
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 0 L50 64 M100 0 L50 64"
                  fill="none"
                  stroke="var(--m-crease)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              {/* gold hairline along the pocket lip */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/75 to-transparent" />
              {/* shading cast by the card resting behind */}
              <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-black/[0.07] to-transparent" />
            </div>

            {/* ── ④ Flap (swings back, then dissolves) ─────── */}
            <div
              className="mo-flap absolute inset-x-0 top-0 h-1/2 origin-top [transform-style:preserve-3d]"
              style={{ zIndex: 50 }}
              aria-hidden="true"
            >
              {/* Exterior */}
              <div
                className="absolute inset-0 [backface-visibility:hidden]"
                style={{ clipPath: FLAP_CLIP }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-paper-shade via-paper to-paper-deep" />
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 0 L50 100 L100 0"
                    fill="none"
                    stroke="var(--m-hairline)"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </div>

              {/* Interior lining — visible only mid-sweep.
                  Its rotation origin MUST match the parent's
                  (top), else the flip lands off-position. */}
              <div
                className="absolute inset-0 origin-top [backface-visibility:hidden]"
                style={{ clipPath: FLAP_CLIP, transform: "rotateX(180deg)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-seal-deep via-seal-deep to-lining" />
                <span className="absolute top-[38%] left-1/2 -translate-x-1/2 font-script text-[22px] text-accent-soft/80">
                  {hosts.monogram}
                </span>
              </div>
            </div>

            {/* ── ⑤ Wax seal (on the flap apex) ───────────── */}
            <div
              className="absolute top-1/2 left-1/2 w-[27%] -translate-x-1/2 -translate-y-1/2"
              style={{ zIndex: 60 }}
            >
              <WaxSeal monogram={hosts.monogram} />
            </div>
          </div>
        </div>
      </div>

      {/* Persistent brand signature beneath the seal */}
      <p className="mt-5 font-script text-[15px] text-accent/70 sm:text-[17px]">
        {brand.en}
      </p>
    </div>
  );
}