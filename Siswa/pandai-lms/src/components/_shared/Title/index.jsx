import React from 'react';

export default function Title({
  children,
  level = 'h1',
  withLogo = false,
  className = '',
  logoSize = 'w-8',
  logoAnimation = 'animate-bounce',
  mb = 'mb-8',
}) {
  const TitleTag = level;
  const baseStyles = `font-bold ${mb} flex items-center gap-2 bg-gradient-to-r from-black to-[#003EC0] bg-clip-text text-transparent`;
  const sizeStyles = {
    h1: 'text-[28px]',
    h2: 'text-[24px]',
    h3: 'text-[22px]',
    h4: 'text-[20px]',
    h5: 'text-[18px]',
    h6: 'text-[16px]',
  };

  const combinedClassName =
    `${baseStyles} ${sizeStyles[level]} ${className}`.trim();

  return (
    <TitleTag className={combinedClassName}>
      {children}
      {withLogo && (
        <div
          className={`bg-logo-only bg-cover bg-no-repeat ${logoSize} aspect-42/34 inline-block ${logoAnimation}`}
        ></div>
      )}
    </TitleTag>
  );
}
