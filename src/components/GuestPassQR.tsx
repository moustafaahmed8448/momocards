import { QRCodeSVG } from "qrcode.react";
import { useInvitation } from "./InvitationProvider";

export default function GuestPassQR() {
  const { pass } = useInvitation();
  const { url, code, hint } = pass;

  return (
    <figure className="mo-qr flex w-full flex-col items-center gap-2.5 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-4">
      <div className="rounded-xl bg-white p-2.5 shadow-[0_6px_18px_-8px_rgba(0,0,0,0.9)]">
        <QRCodeSVG
          value={url}
          size={132}
          level="M"
          bgColor="#ffffff"
          fgColor="var(--m-qr-fg)"
          marginSize={0}
          title={`Guest pass ${code}`}
          className="h-auto w-[124px]"
        />
      </div>

      <figcaption className="flex flex-col items-center gap-1 text-center">
        <span className="rounded-md border border-accent/35 bg-accent/10 px-2 py-0.5 font-mono text-[11px] tracking-[0.14em] text-accent-soft">
          {code}
        </span>
        <p className="font-amiri text-[12.5px] leading-snug font-bold text-paper/85">
          {hint.ar}
        </p>
        <p className="font-cairo text-[9.5px] leading-snug tracking-[0.14em] text-paper/40 uppercase">
          {hint.en}
        </p>
      </figcaption>
    </figure>
  );
}