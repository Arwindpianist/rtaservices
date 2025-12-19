import { Variants } from "framer-motion";

// Check for reduced motion preference
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Animation durations (200-300ms as per requirements)
const DURATION = 0.25;
const EASING = [0.22, 1, 0.36, 1] as const; // ease-out

// Common animation variants - optimized for GPU (transform, opacity)
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: DURATION, ease: EASING as [number, number, number, number] }
  }
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: DURATION, ease: EASING as [number, number, number, number] }
  }
};

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: DURATION, ease: EASING as [number, number, number, number] }
  }
};

export const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: DURATION, ease: EASING as [number, number, number, number] }
  }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: DURATION, ease: EASING as [number, number, number, number] }
  }
};

// Stagger container for children (cards, logos, etc.)
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
};

// Reduced motion variants (no animation)
export const noMotion: Variants = {
  hidden: { opacity: 1, y: 0, x: 0, scale: 1 },
  visible: { opacity: 1, y: 0, x: 0, scale: 1 }
};

// Get animation variants based on user preference
export const getAnimationVariants = (variants: Variants): Variants => {
  if (prefersReducedMotion()) {
    return noMotion;
  }
  return variants;
};

// Viewport detection for once-only animations
export const viewportOptions = {
  once: true,
  margin: "-100px",
  amount: 0.2
};

