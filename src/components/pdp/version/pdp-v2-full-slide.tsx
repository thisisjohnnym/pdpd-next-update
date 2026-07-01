import Image from "next/image";

/**
 * v2-only full-viewport image section (Paper AJ2-0 "Slide studio product",
 * Paper B39-0 "Slide trench portrait").
 *
 * Occupies 100svh × 100% width with no overlays or captions — pure image.
 * Use `objectPosition` to control focal point.
 */
export function PdpV2FullSlide({
  src,
  alt,
  objectPosition = "center",
}: {
  src: string;
  alt: string;
  objectPosition?: string;
}) {
  return (
    <section
      data-header-surface="dark"
      className="relative w-full shrink-0 overflow-hidden bg-neutral-100"
      style={{ height: "100svh" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        style={{ objectPosition }}
        sizes="100vw"
        priority={false}
      />
    </section>
  );
}
