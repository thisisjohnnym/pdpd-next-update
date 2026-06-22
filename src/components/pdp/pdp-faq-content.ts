import { PDP_FAQ, type PdpFaqItem } from "./pdp-data";
import type { PdpProductId } from "./pdp-products";

export type PdpFaqContent = {
  title: string;
  items: PdpFaqItem[];
};

const KIRA_FAQ_CONTENT: PdpFaqContent = {
  title: "FAQs",
  items: [
    {
      id: "what-fits",
      question: "What fits inside the Kira Crossbody?",
      answer:
        "Phone, wallet, keys, and a slim card case fit comfortably. Two zip compartments and built-in card slots keep everyday essentials organized.",
    },
    {
      id: "straps-included",
      question: "Which straps are included?",
      answer:
        "Kira includes a removable wristlet strap. Add a chain crossbody strap for hands-free wear — both clip to the same gold hardware.",
    },
    {
      id: "crossbody",
      question: "Can I wear it crossbody?",
      answer:
        "Yes. Clip on a chain crossbody strap for hands-free carry, or use the included wristlet for coffee runs and evenings out.",
    },
    {
      id: "leather-care",
      question: "How do I care for pebbled leather?",
      answer:
        "Wipe with a soft dry cloth after wear. For deeper cleaning, use Coach Leather Cleaner and follow with Leather Conditioner — both are safe for pebbled leather.",
    },
    {
      id: "returns",
      question: "What is the return policy?",
      answer:
        "Full-price items can be returned within 30 days with original receipt. Bags must be unworn with tags attached. Outlet purchases follow store policy — ask in store or chat for details.",
    },
    {
      id: "hardware",
      question: "Is the hardware durable?",
      answer:
        "Gold-tone zippers and clasp hardware are built for daily use. The signature C detail and coated metal are designed to hold up through everyday open-and-close.",
    },
  ],
};

const TABBY_FAQ_CONTENT: PdpFaqContent = {
  title: PDP_FAQ.title,
  items: [...PDP_FAQ.items],
};

const FAQ_BY_PRODUCT: Record<PdpProductId, PdpFaqContent> = {
  tabby: TABBY_FAQ_CONTENT,
  kira: KIRA_FAQ_CONTENT,
};

export function getPdpFaqContent(productId: PdpProductId): PdpFaqContent {
  return FAQ_BY_PRODUCT[productId] ?? TABBY_FAQ_CONTENT;
}
