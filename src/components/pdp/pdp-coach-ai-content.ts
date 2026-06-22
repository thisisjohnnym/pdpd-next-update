import {
  PDP_AI_CONCIERGE,
  type PdpAiConciergePrompt,
} from "./pdp-data";
import type { PdpProductId } from "./pdp-products";

export type PdpCoachAiContent = {
  placeholder: string;
  sheetPlaceholder: string;
  fallbackResponse: {
    headline: string;
    body: string;
  };
  prompts: PdpAiConciergePrompt[];
};

const KIRA_COACH_AI_CONTENT: PdpCoachAiContent = {
  placeholder:
    "Ask anything about Kira — styling, sizing, straps, real customer photos…",
  sheetPlaceholder: "Ask about styling, sizing, straps…",
  fallbackResponse: {
    headline: "I'm on it",
    body: "I can pull styling inspiration, occasion advice, strap options, and real customer photos for Kira. Try one of the prompts below, or keep typing.",
  },
  prompts: [
    {
      id: "nyc-styling",
      question: "Show me how people style Kira in NYC.",
      icon: "location_city",
      category: "Styling",
      response: {
        headline: "Kira on NYC streets",
        body: "City shoppers wear it wristlet for coffee runs and crossbody on weekends. Compact pebbled leather and gold hardware pair with denim, trenches, and subway commutes.",
        highlights: ["Wristlet for errands", "Crossbody on weekends", "Pairs with denim + coats"],
        images: [
          {
            src: "/images/gallery/kira-crossbody-wristlet-lifestyle.jpg",
            alt: "Customer styling Kira Crossbody with a monogram trench in the city",
          },
          {
            src: "/images/gallery/kira-crossbody-on-model-trench.png",
            alt: "Model wearing Kira Crossbody crossbody with a signature C trench coat",
          },
        ],
      },
    },
    {
      id: "wedding-guest",
      question: "Would this work for a wedding guest outfit?",
      icon: "celebration",
      category: "Occasion",
      response: {
        headline: "Yes — polished without competing",
        body: "Black Kira reads dressy without pulling focus from the outfit. Customers style it crossbody with tailored separates, satin, and minimal jewelry.",
        highlights: ["Crossbody reads refined", "Black leather works with color", "Compact enough for dancing"],
        images: [
          {
            src: "/images/gallery/kira-crossbody-on-model-trench.png",
            alt: "Kira Crossbody styled for a polished day out",
          },
          {
            src: "/images/gallery/kira-crossbody-wristlet-lifestyle.jpg",
            alt: "Model holding Kira Crossbody by the wristlet strap",
          },
        ],
      },
    },
    {
      id: "carry-options",
      question: "Can I wear it as a wristlet and crossbody?",
      icon: "swap_horiz",
      category: "Wear",
      response: {
        headline: "Both — removable wristlet",
        body: "Kira ships with a removable wristlet strap. Add a chain crossbody strap for hands-free evenings — same gold hardware throughout.",
        highlights: ["Removable wristlet included", "Chain strap for crossbody", "Gold hardware match"],
        images: [
          {
            src: "/images/gallery/kira-crossbody-product-hero.jpg",
            alt: "Kira Crossbody with removable wristlet strap and gold hardware",
          },
          {
            src: "/images/gallery/kira-crossbody-hardware-detail.jpg",
            alt: "Close-up of Kira Crossbody gold clasp and strap attachment",
          },
        ],
      },
    },
    {
      id: "customer-photos",
      question: "Show me real customer photos of Kira.",
      icon: "photo_library",
      category: "Community",
      response: {
        headline: "Real Kira carry, real photos",
        body: "Wristlet and crossbody carry show up most in customer photos — compact on the hip, hands free, and easy to dress up or down.",
        highlights: ["Wristlet for hands-free", "Crossbody on the hip", "Verified buyer photos"],
        images: [
          {
            src: "/images/gallery/kira-crossbody-wristlet-lifestyle.jpg",
            alt: "Customer photo of Kira Crossbody worn with a monogram trench",
          },
          {
            src: "/images/gallery/kira-crossbody-interior-open.jpg",
            alt: "Customer photo of Kira Crossbody interior with zip compartments",
          },
        ],
      },
    },
  ],
};

const TABBY_COACH_AI_CONTENT: PdpCoachAiContent = {
  placeholder: PDP_AI_CONCIERGE.placeholder,
  sheetPlaceholder: "Ask about styling, sizing, charms…",
  fallbackResponse: PDP_AI_CONCIERGE.fallbackResponse,
  prompts: [...PDP_AI_CONCIERGE.prompts],
};

const COACH_AI_BY_PRODUCT: Record<PdpProductId, PdpCoachAiContent> = {
  tabby: TABBY_COACH_AI_CONTENT,
  kira: KIRA_COACH_AI_CONTENT,
};

export function getPdpCoachAiContent(productId: PdpProductId): PdpCoachAiContent {
  return COACH_AI_BY_PRODUCT[productId] ?? TABBY_COACH_AI_CONTENT;
}

export function resolveCoachAiAnswer(
  content: PdpCoachAiContent,
  question: string,
  promptId: string | null,
) {
  const byId = promptId
    ? content.prompts.find((prompt) => prompt.id === promptId)
    : undefined;
  const byText = content.prompts.find(
    (prompt) => prompt.question.toLowerCase() === question.trim().toLowerCase(),
  );
  const matched = byId ?? byText;

  if (matched) {
    return matched.response;
  }

  return content.fallbackResponse;
}
