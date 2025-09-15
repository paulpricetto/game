declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';

export function pageview(url: string) {
  if (typeof window === 'undefined') return;
  if (!GA_MEASUREMENT_ID) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).gtag?.('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
}

export function event(
  action: string,
  params: Record<string, unknown> = {}
) {
  if (typeof window === 'undefined') return;
  if (!GA_MEASUREMENT_ID) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).gtag?.('event', action, params);
}


