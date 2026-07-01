import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/cn";

/** Paper `60Y-0` — updated hero + nav glyphs (Material Icons paths). */

const VIEW_BOX = "0 -960 960 960";

const PATHS = {
  likeOutline:
    "m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z",
  likeFilled:
    "m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Z",
  comment:
    "M246-405h311v-75H246v75Zm0-118h468v-75H246v75Zm0-118h468v-75H246v75ZM90-95v-701q0-30.94 22.03-52.97Q134.06-871 165-871h630q30.94 0 52.97 22.03Q870-826.94 870-796v472q0 30.94-22.03 52.97Q825.94-249 795-249H244L90-95Zm122.5-229H795v-472H165v519l47.5-47Zm-47.5 0v-472 472Z",
  bookmarkAdd:
    "M208-132v-624q0-30.94 22.03-52.97Q252.06-831 283-831h239v75H283v510l197-85.07L677-246v-275h75v389L480-248 208-132Zm75-624h239-239Zm394 160v-80h-80v-75h80v-80h75v80h80v75h-80v80h-75Z",
  bookmarkAdded:
    "M706.5-596 597-705.5l52.5-53.5 57 57 141-142 53.5 53.5L706.5-596ZM208-132v-624q0-31 22-53t53-22h279q-19.5 26.5-29.75 55.75T522-713.5q0 70 44.25 122.75T677-524.5q21.5 3 37.5 3t37.5-3V-132L480-248 208-132Z",
  ar:
    "m443.85-187.92-197.7-114.23q-17.07-9.85-26.61-26.31T210-364.62v-228.46q0-19.69 9.54-36.15 9.54-16.46 26.61-26.31l197.7-114.23q17.07-9.84 36.15-9.84t36.15 9.84l197.7 114.23q17.07 9.85 26.61 26.31t9.54 36.15v228.46q0 19.7-9.54 36.16-9.54 16.46-26.61 26.31l-197.7 114.23q-17.07 9.84-36.15 9.84t-36.15-9.84Zm6.15-65.46V-462L270-565.39v200.77q0 3.08 1.54 5.77 1.54 2.7 4.61 4.62L450-253.38Zm60 0 173.85-100.85q3.07-1.92 4.61-4.62 1.54-2.69 1.54-5.77v-200.77L510-462v208.62ZM100-680v-107.69q0-29.92 21.19-51.12Q142.39-860 172.31-860H280v60H172.31q-5.39 0-8.85 3.46t-3.46 8.85V-680h-60Zm180 580H172.31q-29.92 0-51.12-21.19Q100-142.39 100-172.31V-280h60v107.69q0 5.39 3.46 8.85t8.85 3.46H280v60Zm400 0v-60h107.69q5.39 0 8.85-3.46t3.46-8.85V-280h60v107.69q0 29.92-21.19 51.12Q817.61-100 787.69-100H680Zm120-580v-107.69q0-5.39-3.46-8.85t-8.85-3.46H680v-60h107.69q29.92 0 51.12 21.19Q860-817.61 860-787.69V-680h-60ZM480-513.69l178.77-104.16-172.62-99.46q-3.07-1.92-6.15-1.92-3.08 0-6.15 1.92l-172.62 99.46L480-513.69Zm0 33.07Zm0-33.07ZM510-462Zm-60 0Z",
  menuClosed:
    "M140-254.62v-59.99h680v59.99H140ZM140-450v-60h680v60H140Zm0-195.39v-59.99h680v59.99H140Z",
  menuOpen:
    "M140-260v-60h488.46v60H140Zm637.85-38.08L595.15-480l182.7-181.54L820-619.38 679.46-480 820-340.23l-42.15 42.15ZM140-450v-60h371.54v60H140Zm0-190v-60h488.46v60H140Z",
  bagEmpty:
    "M252.31-100Q222-100 201-121q-21-21-21-51.31v-455.38Q180-658 201-679q21-21 51.31-21H330v-10q0-62.15 43.92-106.08Q417.85-860 480-860t106.08 43.92Q630-772.15 630-710v10h77.69Q738-700 759-679q21 21 21 51.31v455.38Q780-142 759-121q-21 21-51.31 21H252.31Zm0-60h455.38q4.62 0 8.46-3.85 3.85-3.84 3.85-8.46v-455.38q0-4.62-3.85-8.46-3.84-3.85-8.46-3.85H630v90q0 12.77-8.62 21.38Q612.77-520 600-520t-21.38-8.62Q570-537.23 570-550v-90H390v90q0 12.77-8.62 21.38Q372.77-520 360-520t-21.38-8.62Q330-537.23 330-550v-90h-77.69q-4.62 0-8.46 3.85-3.85 3.84-3.85 8.46v455.38q0 4.62 3.85 8.46 3.84 3.85 8.46 3.85ZM390-700h180v-10q0-37.61-26.19-63.81Q517.62-800 480-800q-37.62 0-63.81 26.19Q390-747.61 390-710v10ZM240-160v-480 480Z",
  bagFilled:
    "M630 -700L707.69 -700C727.897 -700 745 -693 759 -679C773 -665 780 -647.897 780 -627.69L780 -172.31C780 -152.103 773 -135 759 -121C745 -107 727.897 -100 707.69 -100L252.31 -100C232.103 -100 215 -107 201 -121C187 -135 180 -152.103 180 -172.31L180 -627.69C180 -647.897 187 -665 201 -679C215 -693 232.103 -700 252.31 -700L330 -700L330 -710C330 -751.433 344.64 -786.793 373.92 -816.08C403.207 -845.36 438.567 -860 480 -860C521.433 -860 556.793 -845.36 586.08 -816.08C615.36 -786.793 630 -751.433 630 -710L630 -700ZM390 -710L390 -700L570 -700L570 -710C570 -735.073 561.27 -756.343 543.81 -773.81C526.35 -791.27 505.08 -800 480 -800C454.92 -800 433.65 -791.27 416.19 -773.81C398.73 -756.343 390 -735.073 390 -710Z",
} as const;

type GlyphSvgProps = {
  size?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

function GlyphSvg({ size = 24, className, style, children }: GlyphSvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={VIEW_BOX}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block shrink-0", className)}
      style={style}
      aria-hidden
    >
      {children}
    </svg>
  );
}

function GlyphPath({
  d,
  fill = "currentColor",
}: {
  d: string;
  fill?: string;
}) {
  return <path d={d} fill={fill} />;
}

export function PdpHeroMenuGlyph({
  open = false,
  size = 24,
  className,
}: {
  open?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <GlyphSvg size={size} className={className}>
      <GlyphPath d={open ? PATHS.menuOpen : PATHS.menuClosed} />
    </GlyphSvg>
  );
}

export function formatHeroBagCount(count: number) {
  if (count > 9) {
    return "+9";
  }
  return String(count).padStart(2, "0");
}

export function PdpHeroBagGlyph({
  count = 0,
  size = 24,
  className,
}: {
  count?: number;
  size?: number;
  className?: string;
}) {
  const hasItems = count > 0;

  if (!hasItems) {
    return (
      <GlyphSvg size={size} className={className}>
        <GlyphPath d={PATHS.bagEmpty} />
      </GlyphSvg>
    );
  }

  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <GlyphSvg size={size}>
        <GlyphPath d={PATHS.bagFilled} fill="#272727" />
      </GlyphSvg>
      <span
        aria-hidden
        className="pdp-bag-badge pointer-events-none absolute text-[10px] leading-none tracking-[0.1px] text-white tabular-nums"
      >
        {formatHeroBagCount(count)}
      </span>
    </span>
  );
}

export function PdpHeroLikeGlyph({
  filled = false,
  size = 24,
  className,
  style,
}: {
  filled?: boolean;
  size?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <GlyphSvg size={size} className={className} style={style}>
      <GlyphPath d={filled ? PATHS.likeFilled : PATHS.likeOutline} />
    </GlyphSvg>
  );
}

export function PdpHeroCommentGlyph({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <GlyphSvg size={size} className={className}>
      <GlyphPath d={PATHS.comment} />
    </GlyphSvg>
  );
}

export function PdpHeroBookmarkGlyph({
  saved = false,
  size = 24,
  className,
}: {
  saved?: boolean;
  size?: number;
  className?: string;
}) {
  return (
    <GlyphSvg size={size} className={className}>
      <GlyphPath d={saved ? PATHS.bookmarkAdded : PATHS.bookmarkAdd} />
    </GlyphSvg>
  );
}

export function PdpHeroArGlyph({
  size = 24,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <GlyphSvg size={size} className={className}>
      <GlyphPath d={PATHS.ar} />
    </GlyphSvg>
  );
}
