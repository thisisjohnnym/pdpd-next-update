export type PdpNavHighlight = {
  id: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
  layout: "full" | "half";
};

export type PdpNavCategory = {
  id: string;
  label: string;
  children: string[];
};

export const PDP_NAV = {
  searchPlaceholder: "Search",
  highlights: [
    {
      id: "new-arrivals",
      label: "New Arrivals",
      imageSrc: "/images/gallery/tabby-hero-model.png",
      imageAlt: "Model carrying a metallic Tabby shoulder bag",
      layout: "full",
    },
    {
      id: "shop-womens",
      label: "Shop Womens",
      imageSrc: "/images/gallery/tabby-on-model-trench.jpg",
      imageAlt: "Woman in a trench coat carrying a Tabby bag",
      layout: "half",
    },
    {
      id: "shop-mens",
      label: "Shop Mens",
      imageSrc: "/images/gallery/hero-model-bomber.png",
      imageAlt: "Man in a leather bomber jacket",
      layout: "half",
    },
  ] satisfies PdpNavHighlight[],
  categories: [
    {
      id: "women",
      label: "Women",
      children: ["New arrivals", "Bags", "Ready to wear", "Shoes", "Accessories"],
    },
    {
      id: "bags",
      label: "Bags",
      children: ["Shoulder bags", "Crossbody", "Totes", "Backpacks", "Wallets"],
    },
    {
      id: "shoes",
      label: "Shoes",
      children: ["Flats", "Heels", "Boots", "Sneakers", "Sandals"],
    },
    {
      id: "mens",
      label: "Mens",
      children: ["Bags", "Outerwear", "Shoes", "Accessories", "Gifts"],
    },
    {
      id: "gifts",
      label: "Gifts",
      children: ["For her", "For him", "Under $150", "Personalization", "Gift cards"],
    },
    {
      id: "coachtopia",
      label: "Coachtopia",
      children: ["Shop Coachtopia", "Circularity", "Our materials", "Repair & care"],
    },
    {
      id: "featured",
      label: "Featured",
      children: ["Tabby family", "Soft Tabby", "Brooklyn", "Editor's picks", "Sale"],
    },
  ] satisfies PdpNavCategory[],
} as const;
