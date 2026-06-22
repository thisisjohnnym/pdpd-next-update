import {
  PDP_CUSTOMER_REVIEWS,
  PDP_REVIEW_REPLIES,
  PDP_REVIEWS_AI_SUMMARY,
  PDP_UGC_REVIEW_STORIES,
  type PdpFeaturedReview,
  type PdpReviewReply,
  type PdpUgcStory,
} from "./pdp-data";
import type { PdpProductId } from "./pdp-products";

export type PdpReviewsContent = {
  customerReviews: PdpFeaturedReview[];
  reviewReplies: Record<string, PdpReviewReply[]>;
  aiSummaryBody: string;
  ugcStories: PdpUgcStory[];
};

const KIRA_CUSTOMER_REVIEWS: PdpFeaturedReview[] = [
  {
    id: "maren",
    rating: 5,
    quote: "me walking out with this bag 😭",
    author: "Maren K.",
    date: "Oct 12, 2025",
    verified: true,
    likes: 31_400,
    photos: [
      {
        src: "/images/reviews/comment-cat.gif",
        alt: "Nyan Cat uploaded with comment",
      },
    ],
  },
  {
    id: "jules",
    rating: 5,
    quote: "Weekend errands tested. Wristlet or crossbody, zero bulk 💯",
    author: "Jules T.",
    date: "Sep 28, 2025",
    verified: true,
    likes: 9_400,
  },
  {
    id: "priya",
    rating: 5,
    quote: "The pebbled leather in person >>> photos 😍",
    author: "Priya S.",
    date: "Sep 14, 2025",
    verified: true,
    likes: 25_700,
    photos: [
      {
        src: "/images/gallery/kira-crossbody-product-hero.jpg",
        alt: "Customer photo of Kira Crossbody in black pebbled leather",
      },
    ],
  },
  {
    id: "elena",
    rating: 4,
    quote: "Gold zippers feel premium. Fits phone + card case easily 🤍",
    author: "Elena R.",
    date: "Aug 30, 2025",
    likes: 19,
  },
  {
    id: "danielle",
    rating: 5,
    quote: "Phone, wallet, keys — compact but never cramped 👏",
    author: "Danielle M.",
    date: "Aug 18, 2025",
    likes: 34,
  },
  {
    id: "sofia",
    rating: 5,
    quote: "Black goes with literally everything 🖤 love the wristlet",
    author: "Sofia L.",
    date: "Jul 22, 2025",
    likes: 21,
  },
  {
    id: "hannah",
    rating: 5,
    quote: "Treat yourself purchase, zero regrets. Perfect coffee-run size ☕",
    author: "Hannah W.",
    date: "Jul 9, 2025",
    verified: true,
    likes: 15_800,
  },
  {
    id: "taylor",
    rating: 4,
    quote: "Classic Coach hardware, easy hands-free carry 👌",
    author: "Taylor B.",
    date: "Jun 25, 2025",
    likes: 15,
  },
  {
    id: "nicole",
    rating: 5,
    quote: "Downsized from a tote and this is the one for errands 🙌",
    author: "Nicole A.",
    date: "Jun 3, 2025",
    likes: 38,
  },
  {
    id: "rachel",
    rating: 5,
    quote: "Gold hardware on black leather? Stunning ✨",
    author: "Rachel P.",
    date: "May 19, 2025",
    likes: 31,
  },
  {
    id: "amanda",
    rating: 4,
    quote: "Packaged beautifully, wristlet drop is perfect on me (5'6\") 📦",
    author: "Amanda C.",
    date: "May 2, 2025",
    likes: 12,
  },
  {
    id: "lily",
    rating: 5,
    quote: "Default going-out bag now. Brunch to dinner 🥂",
    author: "Lily H.",
    date: "Apr 14, 2025",
    likes: 26,
  },
];

const KIRA_REVIEW_REPLIES: Record<string, PdpReviewReply[]> = {
  maren: [
    {
      id: "maren-r1",
      author: "Sofia L.",
      quote: "Does the wristlet detach easily?",
      date: "Oct 12, 2025",
      likes: 6,
    },
    {
      id: "maren-r2",
      author: "Coach",
      quote: "Yes — removable wristlet with two drop lengths 🖤",
      date: "Oct 12, 2025",
      likes: 18,
      verified: true,
    },
    {
      id: "maren-r3",
      author: "Jules T.",
      quote: "Second this. I wear it crossbody every weekend.",
      date: "Oct 13, 2025",
      likes: 4,
      verified: true,
    },
    {
      id: "maren-r4",
      author: "Maren K.",
      quote: "@Jules the chain strap for nights out ✨",
      date: "Oct 13, 2025",
      likes: 9,
      verified: true,
    },
    {
      id: "maren-r5",
      author: "Nicole A.",
      quote: "Adding to cart rn",
      date: "Oct 13, 2025",
      likes: 3,
    },
    {
      id: "maren-r6",
      author: "Taylor B.",
      quote: "How smooth are the zippers day to day?",
      date: "Oct 14, 2025",
      likes: 2,
    },
    {
      id: "maren-r7",
      author: "Hannah W.",
      quote: "No snagging — lining feels durable too",
      date: "Oct 14, 2025",
      likes: 7,
    },
    {
      id: "maren-r8",
      author: "Elena R.",
      quote: "The pebbled leather hits different in person ✨",
      date: "Oct 14, 2025",
      likes: 5,
    },
    {
      id: "maren-r9",
      author: "Rachel P.",
      quote: "Need this in black ASAP",
      date: "Oct 15, 2025",
      likes: 4,
    },
    {
      id: "maren-r10",
      author: "Priya S.",
      quote: "Black was back in stock last week 👀",
      date: "Oct 15, 2025",
      likes: 11,
      verified: true,
    },
    {
      id: "maren-r11",
      author: "Amanda C.",
      quote: "Smaller than Tabby 20 — fits my phone and card case with room 👀",
      date: "Oct 16, 2025",
      likes: 2,
    },
  ],
};

const KIRA_UGC_REVIEW_STORIES: PdpUgcStory[] = [
  {
    id: "kira-wristlet",
    src: "/images/gallery/kira-crossbody-wristlet-lifestyle.jpg",
    alt: "Customer photo of Kira Crossbody worn with a monogram trench and jeans",
    context: "Hands-free errands",
    scenario: "Monogram trench, denim, and Kira on the wristlet strap.",
    wearer: "Casey W. · Chicago",
    colorway: "Black pebbled leather",
    carry: "Wristlet",
    verified: true,
  },
  {
    id: "kira-trench",
    src: "/images/gallery/kira-crossbody-on-model-trench.png",
    alt: "Customer photo of Kira Crossbody styled with a signature C trench coat",
    context: "Weekend plans",
    scenario: "Signature C trench with Kira crossbody for a polished day out.",
    wearer: "Nina D. · LA",
    colorway: "Black pebbled leather",
    carry: "Crossbody",
    quote: "Compact but fits everything I need.",
  },
  {
    id: "kira-interior",
    src: "/images/gallery/kira-crossbody-interior-open.jpg",
    alt: "Customer photo of Kira Crossbody interior with card slots and zip compartments",
    context: "Inside the bag",
    scenario: "Dual zip compartments and card slots for everyday carry.",
    wearer: "Jordan P. · NYC",
    colorway: "Black pebbled leather",
    carry: "Crossbody",
    verified: true,
  },
];

const TABBY_REVIEWS_CONTENT: PdpReviewsContent = {
  customerReviews: PDP_CUSTOMER_REVIEWS,
  reviewReplies: PDP_REVIEW_REPLIES,
  aiSummaryBody: PDP_REVIEWS_AI_SUMMARY.body,
  ugcStories: PDP_UGC_REVIEW_STORIES,
};

const KIRA_REVIEWS_CONTENT: PdpReviewsContent = {
  customerReviews: KIRA_CUSTOMER_REVIEWS,
  reviewReplies: KIRA_REVIEW_REPLIES,
  aiSummaryBody:
    "Many note that Kira Crossbody is a compact, well-crafted everyday bag that balances structure with ease. The pebbled leather and gold C hardware read polished without feeling fussy.",
  ugcStories: KIRA_UGC_REVIEW_STORIES,
};

const REVIEWS_BY_PRODUCT: Record<PdpProductId, PdpReviewsContent> = {
  tabby: TABBY_REVIEWS_CONTENT,
  kira: KIRA_REVIEWS_CONTENT,
};

export function getPdpReviewsContent(productId: PdpProductId): PdpReviewsContent {
  return REVIEWS_BY_PRODUCT[productId] ?? TABBY_REVIEWS_CONTENT;
}
