'use client';
import React, { useEffect, useState } from 'react';

interface FadeInAnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  className?: string;
}

export default function FadeInAnimation({ 
  children, 
  delay = 0, 
  duration = 600,
  direction = 'fade',
  className = ''
}: FadeInAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getTransform = () => {
    switch (direction) {
      case 'up':
        return isVisible ? 'translateY(0)' : 'translateY(30px)';
      case 'down':
        return isVisible ? 'translateY(0)' : 'translateY(-30px)';
      case 'left':
        return isVisible ? 'translateX(0)' : 'translateX(30px)';
      case 'right':
        return isVisible ? 'translateX(0)' : 'translateX(-30px)';
      default:
        return 'translateY(0)';
    }
  };

  return (
    <div
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
}
