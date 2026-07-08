import {
  PDP_GALLERY_SLIDES,
  type PdpGalleryImmersiveSlide,
  type PdpGallerySlide,
  type PdpUgcVideo,
} from "../pdp-data";
import type {
  PdpHeroGallerySlide,
  PdpHeroSurface,
} from "../pdp-hero-gallery-data";

/**
 * v2-only editorial carousel marker (Paper AN3-0 / BV4-0).
 * A standalone 4-card horizontal rail with its own image + caption data
 * (`PDP_EDITORIAL_V2_CARDS`) — it does NOT wrap v1 gallery slide renderers.
 */
export type PdpGalleryEditorialCarouselSlide = {
  type: "editorial-carousel-v2";
};

/**
 * v2-only "Carried by the community" section — replaces the v1 ugc-videos slide.
 * Rendered as a coverflow carousel of portrait TikTok creator cards (Paper AFC-0).
 */
export type PdpGalleryUgcCommunitySlide = {
  type: "ugc-community";
};

/** v5-only styling carousel — shoulder, crossbody, and on-model looks */
export type PdpGalleryWaysToWearSlide = {
  type: "ways-to-wear";
};

/** v5-only full-bleed video between leather aging and reviews */
export type PdpGalleryCraftedToLastVideoSlide = {
  type: "crafted-to-last-video";
};

/** v5-only Apple-style "Get the highlights" horizontal card rail */
export type PdpGalleryGetTheHighlightsSlide = {
  type: "get-the-highlights";
};

/** v4 immersive slide — optional headline/subtext copy above the frame (Paper KJY-0). */
export type PdpGalleryImmersiveSlideV2 = PdpGalleryImmersiveSlide & {
  headline?: string;
  subtext?: string;
};

/** v2 slide union — every v1 slide plus v2-only slide types */
export type PdpGallerySlideV2 =
  | Exclude<PdpGallerySlide, PdpGalleryImmersiveSlide>
  | PdpGalleryImmersiveSlideV2
  | PdpGalleryEditorialCarouselSlide
  | PdpGalleryUgcCommunitySlide
  | PdpGalleryWaysToWearSlide
  | PdpGalleryCraftedToLastVideoSlide
  | PdpGalleryGetTheHighlightsSlide;

/** One editorial card in the AN3-0 carousel — image + caption, optional CTA on the last card */
export type PdpEditorialV2Card = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  cta?: { label: string; href: string };
};

/** v4 craftsmanship card — title + short body beneath a large image */
export type PdpCraftsmanshipV4Card = {
  id: string;
  title: string;
  body: string;
  src: string;
  alt: string;
};

export const PDP_CRAFTSMANSHIP_V4_SECTION = {
  headline: "Get up close and personal",
  intro:
    "A closer look at the materials, hardware, and construction that define the Tabby.",
} as const;

/**
 * v4 craftsmanship editorial — distinct imagery from the Details closer-look
 * tiles and the studio drag-zoom slide (no product-front-916 repeat).
 */
export const PDP_CRAFTSMANSHIP_V4_CARDS = [
  {
    id: "leather",
    title: "Glove-tanned leather",
    body: "Soft, full-grain leather designed to develop character over time.",
    src: "/images/gallery/tabby-leather-full-grain-closeup.jpg",
    alt: "Close-up of Tabby Shoulder Bag 26 full-grain leather with gold COACH hardware and hangtag",
  },
  {
    id: "hardware",
    title: "Signature hardware",
    body: "The iconic C clasp brings Coach heritage into focus.",
    src: "/images/gallery/tabby-c-clasp-closeup.jpg",
    alt: "Close-up of the gold C turn-lock clasp with COACH engraving on black glovetanned leather",
  },
  {
    id: "interior",
    title: "Interior function",
    body: "Room for daily essentials with thoughtful organization.",
    src: "/images/gallery/tabby-leather-interior-open.jpg",
    alt: "Open interior of Tabby Shoulder Bag 26 showing accordion compartments and gold hardware",
  },
  {
    id: "carry",
    title: "Carry options",
    body: "Designed to be worn shoulder or crossbody.",
    src: "/images/gallery/tabby-shoulder-crossbody-straps.jpg",
    alt: "Tabby Shoulder Bag 26 in black leather with shoulder and crossbody straps attached",
  },
] satisfies PdpCraftsmanshipV4Card[];

export const PDP_EDITORIAL_V2_CARDS: PdpEditorialV2Card[] = [
  {
    id: "model-tee",
    src: "/images/gallery/tabby-leather-on-model-tee.png",
    alt: "Model wearing Tabby Shoulder Bag 26 with a Coach tee and suede mini skirt",
    caption:
      "Full-grain glovetanned leather with signature hardware — shoulder or crossbody, your call.",
  },
  {
    id: "hardware",
    src: "/images/gallery/tabby-leather-detail-hardware.png",
    alt: "Close-up of Tabby Shoulder Bag 26 full-grain leather and gold C clasp hardware",
    caption:
      "Glovetanned full-grain leather with signature hardware — soft, rich, and made to last.",
  },
  {
    id: "front",
    src: "/images/gallery/tabby-product-front-916.jpg",
    alt: "Tabby Shoulder Bag 26 in black full-grain leather, front studio view",
    caption:
      "See it from every angle — signature C clasp, detachable straps, and glovetanned leather throughout.",
  },
  {
    id: "capacity",
    src: "/images/gallery/tabby-leather-interior-packed.png",
    alt: "Tabby Shoulder Bag 26 interior packed with phone, wallet, and everyday essentials",
    caption: "Three compartments — room for the whole day, never overstuffed.",
    cta: { label: "See what fits inside", href: "#faq-what-fits" },
  },
];

/** v4 section intro — headline + subtext above the editorial carousel (Paper L2X-0). */
export const PDP_EDITORIAL_V2_SECTION = {
  headline: "The craft, up close",
  subtext:
    "On model, in the studio, and packed for the day — full-grain leather from every angle.",
} as const;

/** v4 compact UGC strip — before The Details (Paper r5). */
export const PDP_UGC_COMMUNITY_COMPACT_SECTION = {
  headline: "Out in the wild",
  socialHandle: {
    label: "@coach.ny",
    href: "https://www.instagram.com/coach/",
  },
  /** Portrait tiles shown before the +N more card. */
  previewCount: 3,
} as const;

/** Lifestyle themes for the v5 Out in the wild strip — replaces Videos / Photos. */
export type PdpUgcWildTopicId = "weekend" | "commute" | "going-out" | "style";

type PdpUgcWildTopic = {
  id: PdpUgcWildTopicId;
  label: string;
};

export const PDP_UGC_WILD_TOPICS = [
  { id: "weekend", label: "Weekend" },
  { id: "commute", label: "Commute" },
  { id: "going-out", label: "Going out" },
  { id: "style", label: "Style" },
] satisfies PdpUgcWildTopic[];

/** TikTok clip → theme (ids from `PDP_UGC_VIDEO_CAROUSEL`). */
const PDP_UGC_WILD_VIDEO_TOPICS: Record<string, PdpUgcWildTopicId> = {
  "ugc-rachblaire": "weekend",
  "ugc-katiemcev0y": "commute",
  "ugc-itsnani333": "going-out",
  "ugc-lolalilylang": "style",
};

/** v4 section intro — subtext between headline and TikTok CTA (Paper L5X-0). */
export const PDP_UGC_COMMUNITY_SECTION = {
  subtext: "Real people, real context.",
} as const;

/** Customer photo in the UGC community carousel — portrait stills with context. */
export type PdpUgcCommunityPhoto = {
  id: string;
  src: string;
  alt: string;
  handle?: string;
  caption?: string;
  /** Short pull quote from the customer */
  quote?: string;
  verified?: boolean;
  /** v5 Out in the wild topic grouping */
  topicId: PdpUgcWildTopicId;
};

/** v4 UGC community photo rail — contextual customer stills (not studio product shots). */
export const PDP_UGC_COMMUNITY_PHOTOS = [
  {
    id: "coffee-run",
    src: "/images/reviews/ugc-coffee-run.png",
    alt: "Customer in a brown track jacket and plaid skirt with Tabby Shoulder Bag 26 outside a coffee shop",
    handle: "Jordan L.",
    caption: "Saturday coffee run",
    quote: "My go-to for slow weekend mornings.",
    verified: true,
    topicId: "weekend",
  },
  {
    id: "city-commute",
    src: "/images/reviews/ugc-on-street.png",
    alt: "Customer at Spring St subway station with Tabby Shoulder Bag 26 and coffee in hand",
    handle: "Alex R.",
    caption: "City commute",
    quote: "Reads polished without feeling precious.",
    verified: true,
    topicId: "commute",
  },
  {
    id: "mirror-selfie",
    src: "/images/reviews/ugc-mirror-selfie.png",
    alt: "Customer mirror selfie with Tabby Shoulder Bag 26",
    handle: "Mia T.",
    caption: "Getting ready",
    quote: "Higher on the hip — exactly where I want it for going out.",
    verified: true,
    topicId: "going-out",
  },
  {
    id: "outfit-flat",
    src: "/images/reviews/ugc-outfit-flat.png",
    alt: "Customer outfit flat lay with Tabby Shoulder Bag 26",
    handle: "Sam K.",
    caption: "OOTD flat lay",
    quote: "Anchors the whole look without trying too hard.",
    topicId: "style",
  },
  {
    id: "white-tabby-home",
    src: "/images/reviews/ugc-white-tabby-home.png",
    alt: "Customer at home with Tabby Shoulder Bag 26 in chalk leather on a sofa",
    handle: "Emma W.",
    caption: "At home",
    quote: "The chalk leather looks even better in natural light.",
    verified: true,
    topicId: "weekend",
  },
  {
    id: "katiemcev0y-store",
    src: "/images/reviews/ugc-katiemcev0y.png",
    alt: "TikTok creator @katiemcev0y holding multiple Tabby Shoulder Bag 26 colorways in store",
    handle: "@katiemcev0y",
    caption: "Picking a color",
    quote: "Hard to choose just one — the Tabby 26 works in every finish.",
    verified: true,
    topicId: "commute",
  },
  {
    id: "itsnani333-compare",
    src: "/images/reviews/ugc-itsnani333.png",
    alt: "TikTok creator @itsnani333 comparing Tabby Shoulder Bag 26 and Pillow Tabby",
    handle: "@itsnani333",
    caption: "Tabby family compare",
    quote: "Structured for work days, but I reach for this one on nights out too.",
    verified: true,
    topicId: "going-out",
  },
  {
    id: "pink-tabby-stanley",
    src: "/images/reviews/ugc-pink-tabby-stanley.png",
    alt: "Customer styling a pink quilted Tabby Shoulder Bag 26 with a Stanley tumbler",
    handle: "Priya N.",
    caption: "Desk-to-dinner",
    quote: "The pink quilted Tabby is my everyday desk-to-dinner bag.",
    topicId: "style",
  },
  {
    id: "silver-quilted-charm",
    src: "/images/reviews/ugc-silver-quilted-charm.png",
    alt: "Customer with silver quilted Tabby Shoulder Bag 26 and cherry bag charm",
    handle: "Leah S.",
    caption: "Night out",
    quote: "Added a cherry charm and it instantly felt dressier.",
    verified: true,
    topicId: "going-out",
  },
] satisfies PdpUgcCommunityPhoto[];

/** v5 testimonials band — headline + intro above topic tabs (Figma 409:460). */
export const PDP_UGC_TESTIMONIALS_SECTION = {
  headline: "Out in the wild",
  subtext: "Real people, real context.",
} as const;

/** Editorial testimonial card — quote, attribution, social, and review CTA (v5). */
export type PdpUgcTestimonial = {
  id: string;
  src: string;
  alt: string;
  quote: string;
  authorName: string;
  productLabel: string;
  socialPlatform: "instagram" | "tiktok";
  socialHandle: string;
  socialHref: string;
  topicId: PdpUgcWildTopicId;
  videoSrc?: string;
  /** Nav contrast when promoted into the hero carousel (`dark` → white chrome). */
  heroHeaderSurface?: PdpHeroSurface;
};

// fallow-ignore-next-line unused-export
export const PDP_UGC_TESTIMONIALS = [
  {
    id: "testimonial-coffee-run",
    src: "/images/reviews/ugc-coffee-run.png",
    alt: "Customer in a brown track jacket and plaid skirt with Tabby Shoulder Bag 26 outside a coffee shop",
    quote:
      "My go-to for slow weekend mornings — comfortable, effortless, and goes with everything from coffee runs to brunch. I throw it on crossbody and never think twice about it.",
    authorName: "Jordan L.",
    productLabel: "Tabby Shoulder Bag 26 in Quilted Leather",
    socialPlatform: "instagram",
    socialHandle: "@jordanl.style",
    socialHref: "https://www.instagram.com/coach/",
    topicId: "weekend",
    heroHeaderSurface: "dark",
  },
  {
    id: "testimonial-city-commute",
    src: "/images/reviews/ugc-on-street.png",
    alt: "Customer at Spring St subway station with Tabby Shoulder Bag 26 and coffee in hand",
    quote:
      "Reads polished without feeling precious — I carry it every day on my commute, through the subway and straight to my desk. The strap sits right and the leather still looks crisp by evening.",
    authorName: "Alex R.",
    productLabel: "Tabby Shoulder Bag 26 in Quilted Leather",
    socialPlatform: "instagram",
    socialHandle: "@alexreads",
    socialHref: "https://www.instagram.com/coach/",
    topicId: "commute",
  },
  {
    id: "testimonial-mirror-selfie",
    src: "/images/reviews/ugc-mirror-selfie.png",
    alt: "Customer mirror selfie with Tabby Shoulder Bag 26",
    quote:
      "Higher on the hip — exactly where I want it for going out. The quilting hits different in person, and it holds my phone, lip gloss, and keys without losing its shape all night.",
    authorName: "Mia T.",
    productLabel: "Tabby Shoulder Bag 26 in Quilted Leather",
    socialPlatform: "tiktok",
    socialHandle: "@miatstyles",
    socialHref: "https://www.tiktok.com/@coach",
    topicId: "going-out",
  },
  {
    id: "testimonial-lolalilylang",
    src: "/images/reviews/ugc-lolalilylang.png",
    alt: "TikTok creator @lolalilylang styling Tabby Shoulder Bag 26",
    quote:
      "This front pocket fits more than you'd think — my everyday grab-and-go bag. I style it with everything from jeans to dresses, and the hardware makes even a simple outfit feel pulled together.",
    authorName: "Lola L.",
    productLabel: "Tabby Shoulder Bag 26 in Quilted Leather",
    socialPlatform: "tiktok",
    socialHandle: "@lolalilylang",
    socialHref: "https://www.tiktok.com/@lolalilylang",
    topicId: "style",
    videoSrc: "/videos/ugc-lolalilylang.mp4",
  },
  {
    id: "testimonial-outfit-flat",
    src: "/images/reviews/ugc-outfit-flat.png",
    alt: "Customer outfit flat lay with Tabby Shoulder Bag 26",
    quote:
      "Anchors the whole look without trying too hard. Whether I'm flat-laying an OOTD or running errands, it's the one bag that always makes the outfit feel intentional.",
    authorName: "Sam K.",
    productLabel: "Tabby Shoulder Bag 26 in Quilted Leather",
    socialPlatform: "instagram",
    socialHandle: "@samkootd",
    socialHref: "https://www.instagram.com/coach/",
    topicId: "style",
  },
  {
    id: "testimonial-rachblaire",
    src: "/images/reviews/ugc-rachblaire.png",
    alt: "TikTok creator @rachblaire styling Tabby Shoulder Bag 26",
    quote:
      "Weekend trip tested. Crossbody all day, zero issues — airport, walking around town, dinner out. It carried everything I needed and the strap never dug in.",
    authorName: "Rachel B.",
    productLabel: "Tabby Shoulder Bag 26 in Quilted Leather",
    socialPlatform: "tiktok",
    socialHandle: "@rachblaire",
    socialHref: "https://www.tiktok.com/@rachblaire",
    topicId: "weekend",
    videoSrc: "/videos/ugc-rachblaire.mp4",
  },
  {
    id: "testimonial-white-tabby-home",
    src: "/images/reviews/ugc-white-tabby-home.png",
    alt: "Customer at home with Tabby Shoulder Bag 26 in chalk leather on a sofa",
    quote:
      "The chalk leather looks even better in natural light — my lazy Sunday staple. I keep it by the door for farmers market runs and it still feels elevated without any effort.",
    authorName: "Emma W.",
    productLabel: "Tabby Shoulder Bag 26 in Quilted Leather",
    socialPlatform: "instagram",
    socialHandle: "@emmaw.style",
    socialHref: "https://www.instagram.com/coach/",
    topicId: "weekend",
  },
  {
    id: "testimonial-katiemcev0y",
    src: "/images/reviews/ugc-katiemcev0y.png",
    alt: "TikTok creator @katiemcev0y holding multiple Tabby Shoulder Bag 26 colorways in store",
    quote:
      "Hard to choose just one — the Tabby 26 works in every finish for the office. Structured enough for meetings, but I still take it straight to happy hour without swapping bags.",
    authorName: "Katie M.",
    productLabel: "Tabby Shoulder Bag 26 in Quilted Leather",
    socialPlatform: "tiktok",
    socialHandle: "@katiemcev0y",
    socialHref: "https://www.tiktok.com/@katiemcev0y",
    topicId: "commute",
    videoSrc: "/videos/ugc-katiemcev0y.mp4",
  },
  {
    id: "testimonial-itsnani333",
    src: "/images/reviews/ugc-itsnani333.png",
    alt: "TikTok creator @itsnani333 comparing Tabby Shoulder Bag 26 and Pillow Tabby",
    quote:
      "Structured for work days, but I reach for this one on nights out too. It photographs well, fits the essentials, and the C clasp always gets compliments at the table.",
    authorName: "Nani T.",
    productLabel: "Tabby Shoulder Bag 26 in Quilted Leather",
    socialPlatform: "tiktok",
    socialHandle: "@itsnani333",
    socialHref: "https://www.tiktok.com/@itsnani333",
    topicId: "going-out",
    videoSrc: "/videos/ugc-itsnani333.mp4",
  },
  {
    id: "testimonial-pink-tabby-stanley",
    src: "/images/reviews/ugc-pink-tabby-stanley.png",
    alt: "Customer styling a pink quilted Tabby Shoulder Bag 26 with a Stanley tumbler",
    quote:
      "The pink quilted Tabby is my everyday desk-to-dinner bag. It carries my tumbler, wallet, and laptop charger without looking bulky — and the color pops in every mirror selfie.",
    authorName: "Priya N.",
    productLabel: "Tabby Shoulder Bag 26 in Quilted Leather",
    socialPlatform: "instagram",
    socialHandle: "@priyanstyles",
    socialHref: "https://www.instagram.com/coach/",
    topicId: "style",
  },
  {
    id: "testimonial-silver-quilted-charm",
    src: "/images/reviews/ugc-silver-quilted-charm.png",
    alt: "Customer with silver quilted Tabby Shoulder Bag 26 and cherry bag charm",
    quote:
      "Added a cherry charm and it instantly felt dressier for date night. The silver quilting catches the light, and it's compact enough to wear all evening without switching to a clutch.",
    authorName: "Leah S.",
    productLabel: "Tabby Shoulder Bag 26 in Quilted Leather",
    socialPlatform: "instagram",
    socialHandle: "@leahstyles",
    socialHref: "https://www.instagram.com/coach/",
    topicId: "going-out",
  },
] satisfies PdpUgcTestimonial[];

/** UGC testimonials from "Out in the wild" promoted into the v5 hero carousel. */
export const HERO_GALLERY_V5_UGC_TESTIMONIAL_IDS = [
  "testimonial-rachblaire",
  "testimonial-katiemcev0y",
] as const;

function ugcTestimonialToHeroSlide(
  testimonial: PdpUgcTestimonial,
): PdpHeroGallerySlide {
  const headerSurface = testimonial.heroHeaderSurface ?? "light";

  if (testimonial.videoSrc) {
    return {
      kind: "video",
      src: testimonial.videoSrc,
      poster: testimonial.src,
      alt: testimonial.alt,
      shotType: "lifestyle",
      headerSurface,
      galleryCategory: "ugc",
    };
  }

  return {
    kind: "image",
    src: testimonial.src,
    alt: testimonial.alt,
    shotType: "on-model",
    headerSurface,
    galleryCategory: "ugc",
  };
}

export function buildHeroGallerySlidesFromUgcTestimonials(
  ids: readonly string[],
): PdpHeroGallerySlide[] {
  const byId = new Map(PDP_UGC_TESTIMONIALS.map((item) => [item.id, item]));

  return ids.flatMap((id) => {
    const testimonial = byId.get(id);
    return testimonial ? [ugcTestimonialToHeroSlide(testimonial)] : [];
  });
}

export function listUgcTestimonialsForTopic(
  topicId: PdpUgcWildTopicId,
): PdpUgcTestimonial[] {
  const topicItems = PDP_UGC_TESTIMONIALS.filter((item) => item.topicId === topicId);
  const clips = topicItems.filter((item) => item.videoSrc);
  const photos = topicItems.filter((item) => !item.videoSrc);

  // Lead with TikTok clips, then UGC stills — first frame is always video when available.
  return [...clips, ...photos];
}

export type PdpUgcWildPreviewItem =
  | { kind: "video"; id: string; video: PdpUgcVideo }
  | { kind: "photo"; id: string; photo: PdpUgcCommunityPhoto };

/** Photos + videos for one lifestyle topic — alternates clip then still. */
export function listUgcWildItemsForTopic(
  topicId: PdpUgcWildTopicId,
  videos: readonly PdpUgcVideo[],
): PdpUgcWildPreviewItem[] {
  const photos = PDP_UGC_COMMUNITY_PHOTOS.filter((photo) => photo.topicId === topicId);
  const topicVideos = videos.filter(
    (video) => PDP_UGC_WILD_VIDEO_TOPICS[video.id] === topicId,
  );
  const items: PdpUgcWildPreviewItem[] = [];
  const max = Math.max(photos.length, topicVideos.length);

  for (let index = 0; index < max; index += 1) {
    const video = topicVideos[index];
    const photo = photos[index];

    if (video) {
      items.push({ kind: "video", id: video.id, video });
    }
    if (photo) {
      items.push({ kind: "photo", id: photo.id, photo });
    }
  }

  return items;
}

/**
 * Slide types dropped from the v2 page flow (kept in v1).
 * Source of truth = Paper ADB-0 full scroll. Anything not in that frame is removed here.
 * signature-sounds ("Sounds of Tabby") and weight-feel are v1-only — absent from ADB-0.
 */
const V2_REMOVED_SLIDE_TYPES = new Set<PdpGallerySlide["type"]>([
  "strap-simulation",
  "view-more-photos",
  "ugc-videos",
  "signature-sounds",
  "weight-feel",
]);

/** Studio product slide — AJ2-0; editorial carousel inserts immediately after it */
const STUDIO_PRODUCT_SRC = "/images/gallery/tabby-product-front-916.jpg";

function isStudioProductSlide(slide: PdpGallerySlide): boolean {
  return slide.type === "immersive" && slide.src === STUDIO_PRODUCT_SRC;
}

function isTrenchPortraitSlide(slide: PdpGallerySlide): boolean {
  if (slide.type !== "immersive") {
    return false;
  }
  if (slide.shopTheLookId === "trench-daytime") {
    return true;
  }
  // Color-swapped Tabby lists use a different src but the same on-model trench beat.
  return (
    slide.src.includes("tabby-on-model-trench") ||
    slide.src.includes("silver-soft-purple-on-model-full")
  );
}

function isHardwareDetailSlide(slide: PdpGallerySlide): boolean {
  return slide.type === "immersive" && (slide.hotspots?.length ?? 0) > 0;
}

/**
 * Reshape a v1 slide list into the v2 flow (Paper ADB-0):
 *  1. Drop removed slide types and every standalone `editorial` — all editorial
 *     frames live in `PdpV2EditorialCarousel` (`PDP_EDITORIAL_V2_CARDS`).
 *  2. Drop trench portrait + hardware detail immersives (carousel / ecomm handle them).
 *  3. Insert ugc-community after the studio product slide (Paper AFC-0) — below
 *     product specs and the studio drag-zoom frame, before the editorial carousel.
 *  4. Insert `editorial-carousel-v2` right after ugc-community (Paper AN3-0).
 *
 * When `omitStudioProduct` is true (v4 hero gallery owns the drag-zoom frame),
 * the studio immersive is dropped but the ugc + editorial block still inserts at
 * the top of the scroll gallery.
 *
 * Resulting gallery scroll: The Details → studio product → ugc-community →
 * editorial carousel → leather aging.
 */
export function buildV2Slides(
  v1Slides: PdpGallerySlide[],
  options?: { omitStudioProduct?: boolean },
): PdpGallerySlideV2[] {
  const trimmed = v1Slides.filter((slide) => {
    if (V2_REMOVED_SLIDE_TYPES.has(slide.type)) {
      return false;
    }
    // Every v1 editorial inset is merged into the 4-card carousel — no standalone renders.
    if (slide.type === "editorial") {
      return false;
    }
    if (isTrenchPortraitSlide(slide) || isHardwareDetailSlide(slide)) {
      return false;
    }
    if (options?.omitStudioProduct && isStudioProductSlide(slide)) {
      return false;
    }
    return true;
  });

  const result: PdpGallerySlideV2[] = [];
  let insertedUgcBlock = false;

  const pushUgcBlock = () => {
    if (insertedUgcBlock) {
      return;
    }
    result.push({ type: "ugc-community" });
    result.push({ type: "editorial-carousel-v2" });
    insertedUgcBlock = true;
  };

  if (options?.omitStudioProduct) {
    pushUgcBlock();
  }

  for (const slide of trimmed) {
    result.push(slide);
    if (isStudioProductSlide(slide)) {
      pushUgcBlock();
    }
  }

  return result;
}

/** Tabby v2 gallery — Details, studio product, ugc-community, then editorial carousel */
export const PDP_GALLERY_SLIDES_V2: PdpGallerySlideV2[] = buildV2Slides(PDP_GALLERY_SLIDES);

/** v4 studio drag-zoom slide — 4:5 frame with copy above the image (Paper KJY-0). */
const PDP_STUDIO_PRODUCT_SLIDE_V4 = {
  headline: "Feel the leather",
  subtext:
    "Crafted to be seen—and felt. Full-grain leather, signature hardware, and the details that make every Tabby unique.",
  aspect: "4/5" as const,
  objectPosition: "center 62%",
} as const;

function patchStudioProductSlideForV4(
  slides: PdpGallerySlideV2[],
): PdpGallerySlideV2[] {
  return slides.map((slide) => {
    if (slide.type !== "immersive" || slide.src !== STUDIO_PRODUCT_SRC) {
      return slide;
    }
    return {
      ...slide,
      aspect: PDP_STUDIO_PRODUCT_SLIDE_V4.aspect,
      objectPosition: PDP_STUDIO_PRODUCT_SLIDE_V4.objectPosition,
      headline: PDP_STUDIO_PRODUCT_SLIDE_V4.headline,
      subtext: PDP_STUDIO_PRODUCT_SLIDE_V4.subtext,
    };
  });
}

/** Apply v4-only gallery slide patches (studio product reframing, etc.). */
export function applyV4GallerySlidePatches(
  slides: PdpGallerySlideV2[],
): PdpGallerySlideV2[] {
  return patchStudioProductSlideForV4(slides).filter(
    (slide) => slide.type !== "ugc-community",
  );
}

/** Tabby v4 gallery — same flow as v2 with the studio product slide reframed for r5. */
export const PDP_GALLERY_SLIDES_V4: PdpGallerySlideV2[] = applyV4GallerySlidePatches(
  buildV2Slides(PDP_GALLERY_SLIDES),
);

export const PDP_CRAFTED_TO_LAST_SECTION = {
  headline: "Crafted to last",
  body:
    "Hand-stitched seams and signature hardware on glovetanned full-grain leather — precision you can see and feel up close.",
} as const;

export const PDP_CRAFTED_TO_LAST_VIDEO = {
  src: "/videos/crafted-to-last.webm",
  poster: "/images/posters/crafted-to-last.jpg",
  alt: "Crafted to last — Coach glovetanned leather craftsmanship",
} as const;

/** v5 editorial quote card — 9:16 photo + warm beige pull quote */
export const PDP_V5_EDITORIAL_QUOTE = {
  eyebrow: "Why PinkPantheress loves\u00a0it",
  quote:
    "I wanted a bag that feels effortless on the street, but still pulls a look together in one grab—Tabby does both.",
  attribution: "PinkPantheress",
  src: "/images/editorial/pinkpantheress-tabby.png",
  alt: "PinkPantheress backstage wearing Tabby Shoulder Bag 26",
} as const;

/** v5 design sketch scroll break — warm studio spread before Ways to wear. */
export const PDP_DESIGN_SKETCH_INTERRUPT = {
  headline: "Designed with intention",
  intro:
    "Every line of the Tabby silhouette is measured for balance — proportion, carry, and the signature C clasp in perfect harmony.",
  src: "/images/gallery/tabby-design-sketch-scroll-break.jpg",
  alt: "Design sketch of Tabby Shoulder Bag 26 showing front elevation and strap dimensions",
} as const;

export const PDP_WAYS_TO_WEAR_SECTION = {
  headline: "Made to move",
  body:
    "Designed to adapt throughout the day. Adjust the strap to move effortlessly between shoulder and crossbody carry.",
} as const;

export type PdpWaysToWearStyle = {
  id: string;
  label: string;
  caption: string;
  src: string;
  alt: string;
};

/** Shoulder and crossbody carry — large editorial stills for v5 */
export const PDP_WAYS_TO_WEAR_STYLES = [
  {
    id: "shoulder",
    label: "Shoulder carry",
    caption: "Relaxed, elevated styling for everyday wear.",
    src: "/images/gallery/tabby-shoulder-carry-beige.jpg",
    alt: "Tabby Shoulder Bag 26 worn on the shoulder with a beige top and tailored trousers",
  },
  {
    id: "crossbody",
    label: "Crossbody",
    caption: "Hands-free comfort for commuting and travel.",
    src: "/images/gallery/tabby-crossbody-trench.jpg",
    alt: "Tabby Shoulder Bag 26 worn crossbody with a tan trench coat",
  },
] satisfies PdpWaysToWearStyle[];

/**
 * v5 "Get the highlights" — Apple-style highlight rail that replaces the
 * "Feel the leather" lifestyle beat. Section heading + "Watch the film" link
 * sit above a horizontal rail of tall black cards (top caption, image below).
 */
export const PDP_GET_THE_HIGHLIGHTS_SECTION = {
  headline: "Get the highlights",
  watchLabel: "Watch the film",
} as const;

export type PdpGetTheHighlightsCard = {
  id: string;
  caption: string;
  src: string;
  alt: string;
  /** Focal point for the card image (default center). */
  objectPosition?: string;
};

/** v5 — floating essentials still, used in the highlights rail interior card. */
const WHAT_FITS_INSIDE_V5_STILL_SRC =
  "/images/gallery/tabby-what-fits-inside-still.jpg";

/** Tabby highlight cards — one signature product truth per card. */
export const PDP_GET_THE_HIGHLIGHTS_CARDS: PdpGetTheHighlightsCard[] = [
  {
    id: "leather",
    caption: "Glovetanned full-grain leather that only gets richer with age.",
    src: "/images/gallery/tabby-leather-full-grain-closeup.jpg",
    alt: "Extreme close-up of Tabby's glovetanned full-grain leather grain",
    objectPosition: "center",
  },
  {
    id: "hardware",
    caption: "Signature C turnlock clasp with a secure, satisfying close.",
    src: "/images/gallery/tabby-c-clasp-closeup.jpg",
    alt: "Close-up of the polished gold C turnlock clasp on the Tabby bag",
    objectPosition: "center",
  },
  {
    id: "interior",
    caption: "A roomy interior sized for everything you carry each day.",
    src: WHAT_FITS_INSIDE_V5_STILL_SRC,
    alt: "Tabby Shoulder Bag 26 beside phone, wallet, sunglasses and everyday essentials",
    objectPosition: "center 45%",
  },
  {
    id: "wear",
    caption: "Three ways to wear — shoulder, crossbody, or carried in hand.",
    src: "/images/gallery/tabby-shoulder-carry-beige.jpg",
    alt: "Model wearing the Tabby Shoulder Bag 26 on the shoulder in a beige look",
    objectPosition: "center 30%",
  },
];

/**
 * Insert the v5 Ways to wear module immediately after Up close / editorial
 * carousel, and swap the Feel the leather studio slide for the Apple-style
 * "Get the highlights" rail.
 */
export function applyV5GallerySlidePatches(
  slides: PdpGallerySlideV2[],
): PdpGallerySlideV2[] {
  const result: PdpGallerySlideV2[] = [];

  for (const slide of slides) {
    if (slide.type === "immersive" && slide.src === STUDIO_PRODUCT_SRC) {
      result.push({ type: "get-the-highlights" });
      continue;
    }

    result.push(slide);
    if (slide.type === "editorial-carousel-v2") {
      result.push({ type: "ways-to-wear" });
    }
  }

  return result;
}

/** Insert the v5 crafted-to-last video immediately after leather aging. */
export function applyV5CraftedToLastVideoPatch(
  slides: PdpGallerySlideV2[],
): PdpGallerySlideV2[] {
  const result: PdpGallerySlideV2[] = [];

  for (const slide of slides) {
    result.push(slide);
    if (slide.type === "leather-aging") {
      result.push({ type: "crafted-to-last-video" });
    }
  }

  return result;
}
