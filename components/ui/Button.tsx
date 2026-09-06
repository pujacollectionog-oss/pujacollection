'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-[#be123c] text-white',
    'hover:bg-[#9f1239] active:bg-[#881337]',
    'shadow-sm hover:shadow-lg hover:shadow-rose-900/20',
    'border border-transparent',
  ].join(' '),

  secondary: [
    'bg-transparent text-[#0f172a]',
    'border border-[rgba(180,83,9,0.5)]',
    'hover:border-[#b45309] hover:bg-[rgba(180,83,9,0.06)]',
  ].join(' '),

  ghost: [
    'bg-transparent text-[#0f172a]',
    'hover:bg-[rgba(190,18,60,0.06)]',
    'border border-transparent',
  ].join(' '),

  icon: [
    'bg-transparent text-[#0f172a]',
    'hover:bg-[rgba(190,18,60,0.06)]',
    'border border-transparent',
    'rounded-full',
  ].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs tracking-wider font-bold',
  md: 'px-6 py-2.5 text-xs tracking-wider font-bold',
  lg: 'px-8 py-3.5 text-xs tracking-widest font-bold',
};

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center gap-2',
        'font-sans uppercase rounded-xl',
        'transition-all duration-200 ease-out',
        'cursor-pointer select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantStyles[variant],
        variant === 'icon' ? 'p-2.5' : sizeStyles[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
