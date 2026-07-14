/**
 * Static first-paint hide — no JS required after phase is stamped.
 * Gate on `html[data-hero-intro-phase="playing"]` (boot stamps this on /v5–/v7).
 * Do not require a descendant `[data-pdp-version]` — RSC can stream chrome
 * outside the layout wrapper. Lift on `revealing` so GSAP can tween.
 * Studio ground must live here too — body is black and the hero shell is
 * white; opacity:0 on the buy tray still shows that white band underneath.
 */
export const PDP_V6_INTRO_CRITICAL_CSS = `
html[data-hero-intro-phase="playing"],
html[data-hero-intro-phase="playing"] body{
  background-color:#f0f0f0!important;
}
html[data-hero-intro-phase="playing"] .pdp-hero-intro-chrome,
html[data-hero-intro-phase="playing"] [data-header-chrome]{
  opacity:0!important;
  pointer-events:none!important;
}
html[data-hero-intro-phase="playing"] .pdp-hero-header-enter,
html[data-hero-intro-phase="playing"] .pdp-hero-hud-enter,
html[data-hero-intro-phase="playing"] .pdp-hero-bottom-enter{
  animation:none!important;
}
html[data-hero-intro-phase="playing"] .pdp-hero-shell,
html[data-hero-intro-phase="playing"] .pdp-hero-media-frame--docked,
html[data-hero-intro-phase="playing"] .pdp-hero-docked-footer,
html[data-hero-intro-phase="playing"] .pdp-hero-below-fold-colors,
html[data-hero-intro-phase="playing"] .pdp-hero-360-intro-layer,
html[data-hero-intro-phase="playing"] .pdp-v5-page-root,
html[data-hero-intro-phase="playing"] [data-pdp-page-root]{
  background-color:#f0f0f0!important;
}
html[data-hero-intro-phase="playing"] .pdp-hero-docked-footer::before{
  background:#f0f0f0!important;
}
`;

/**
 * Stamp version + intro phase on <html> before chrome paints.
 * /v5, /v6, /v7, and the /fc01 + /fc01v UXR pair all use the desktop split
 * (lg:hidden mobile hero) — only stamp
 * playing below the lg breakpoint so desktop never hides chrome for a 0x0 video.
 * Keep this string free of bare backticks — it is embedded in a template literal.
 */
export const PDP_V6_INTRO_BOOT_SCRIPT = `
(function () {
  var path = location.pathname;
  var version = null;
  if (/^\\/v5(\\/|$)/.test(path)) version = "v5";
  else if (/^\\/v6(\\/|$)/.test(path)) version = "v6";
  else if (/^\\/v7(\\/|$)/.test(path)) version = "v7";
  else if (/^\\/fc01v(\\/|$)/.test(path)) version = "fc01v";
  else if (/^\\/fc01(\\/|$)/.test(path)) version = "fc01";
  if (!version) return;
  var root = document.documentElement;
  root.setAttribute("data-pdp-version", version);
  var reduce = false;
  var isMobile = true;
  try {
    reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch (e) {}
  try {
    // Tailwind lg = 1024px — desktop split hides the mobile hero above this.
    isMobile = window.matchMedia("(max-width: 1023px)").matches;
  } catch (e) {}
  if (!root.getAttribute("data-hero-intro-phase")) {
    // Mobile only — desktop split would lock on a 0x0 video waiting for ended.
    var playIntro = !reduce && isMobile;
    root.setAttribute("data-hero-intro-phase", playIntro ? "playing" : "ready");
  }
  if (root.getAttribute("data-hero-intro-phase") === "playing") {
    root.style.backgroundColor = "#f0f0f0";
  }
})();
`;
