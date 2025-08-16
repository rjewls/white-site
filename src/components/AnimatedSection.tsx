import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn';
  delay?: number;
  threshold?: number;
  once?: boolean;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  animation = 'fadeInUp',
  delay = 0,
  threshold = 0.1,
  once = true
}) => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold,
    delay,
    once
  });

  const animationClass = isVisible ? `animate-${animation.replace(/([A-Z])/g, '-$1').toLowerCase()}` : '';

  return (
    <div
      ref={elementRef}
      className={`${className} ${isVisible ? 'scroll-animate-visible' : 'scroll-animate-hidden'} ${animationClass}`}
    >
      {children}
    </div>
  );
};
