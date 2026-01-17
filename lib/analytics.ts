// Google Analytics 4 implementation
// Replace GA_MEASUREMENT_ID with your actual Google Analytics 4 Measurement ID

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Initialize gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

// Load Google Analytics script
export const loadGA = () => {
  if (typeof window === 'undefined') return;

  // Load gtag script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });
};

// Track page views
export const pageview = (url: string) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// Track events
export interface EventParams {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const event = ({ action, category, label, value }: EventParams) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// Predefined event helpers
export const trackCTA = (label: string, location: string) => {
  event({
    action: 'cta_click',
    category: 'engagement',
    label: `${label} - ${location}`,
  });
};

export const trackFormStart = (formType: string) => {
  event({
    action: 'form_start',
    category: 'form',
    label: formType,
  });
};

export const trackFormSubmit = (formType: string, success: boolean = true) => {
  event({
    action: 'form_submit',
    category: 'form',
    label: formType,
    value: success ? 1 : 0,
  });
};

export const trackFormError = (formType: string, errorType: string) => {
  event({
    action: 'form_error',
    category: 'form',
    label: `${formType} - ${errorType}`,
  });
};

export const trackServiceView = (serviceName: string) => {
  event({
    action: 'service_view',
    category: 'content',
    label: serviceName,
  });
};

export const trackScrollDepth = (depth: number) => {
  event({
    action: 'scroll_depth',
    category: 'engagement',
    label: `${depth}%`,
    value: depth,
  });
};

export const trackExitIntent = () => {
  event({
    action: 'exit_intent',
    category: 'engagement',
    label: 'user_leaving',
  });
};
