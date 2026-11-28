// Client-side event hook for cookieless analytics (Plausible-compatible).
// No-op when site.analytics is empty: the script is never loaded, so window.plausible is undefined.
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

export type AnalyticsEvent = "CTA click" | "Quiz started" | "Quiz finished" | "WhatsApp click" | "Form sent";

export function track(event: AnalyticsEvent, props?: Record<string, string>): void {
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    // Analytics must never break the page.
  }
}
