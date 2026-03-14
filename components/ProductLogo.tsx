'use client';

import { useState } from 'react';
import Image from 'next/image';

type ProductLogoProps = {
  name: string;
  logo: string;
  size?: number;
  className?: string;
  grayscale?: boolean;
  /** Optional: force show text only (e.g. when logo not yet added) */
  textOnly?: boolean;
};

/**
 * Renders a product/technology logo with fallback to the name when the image fails to load or is missing.
 */
export default function ProductLogo({
  name,
  logo,
  size = 48,
  className = '',
  grayscale = false,
  textOnly = false,
}: ProductLogoProps) {
  const [error, setError] = useState(false);

  if (textOnly || error) {
    return (
      <span
        className={`inline-flex items-center justify-center font-medium text-rta-text text-body-sm ${className}`}
        style={{ minHeight: size, minWidth: size }}
      >
        {name}
      </span>
    );
  }

  return (
    <Image
      src={logo}
      alt={name}
      width={size}
      height={size}
      className={`object-contain ${grayscale ? 'filter grayscale hover:grayscale-0 transition-all duration-300' : ''} ${className}`}
      onError={() => setError(true)}
      unoptimized
    />
  );
}
