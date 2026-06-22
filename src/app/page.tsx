import { redirect } from "next/navigation";

import { DEFAULT_TABBY_SLUG } from "@/components/pdp/pdp-tabby-variants";

export default function Home() {
  redirect(`/products/${DEFAULT_TABBY_SLUG}`);
}
