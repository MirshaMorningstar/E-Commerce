
import { useEffect, useRef } from 'react';

export type AutoScrollOptions = {
  speed?: number;        // Pixels per interval
  interval?: number;     // Milliseconds between scroll movements
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  reverseOnEdges?: boolean;
};

export function useAutoScroll(
  elementId: string, 
  options: AutoScrollOptions = {}
) {
  const {
    speed = 1,
    interval = 50,
    direction = 'right',
    pauseOnHover = true,
    reverseOnEdges = true
  } = options;
  
  const directionRef = useRef<'left' | 'right'>(direction);
  const isPausedRef = useRef<boolean>(false);
  
  useEffect(() => {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let initialDirection = direction === 'right' ? 1 : -1;
    let scrollAmount = speed * initialDirection;
    
    // Set up pause on hover
    const handleMouseEnter = () => {
      if (pauseOnHover) {
        isPausedRef.current = true;
      }
    };
    
    const handleMouseLeave = () => {
      isPausedRef.current = false;
    };
    
    if (pauseOnHover) {
      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      element.addEventListener('touchstart', handleMouseEnter);
      element.addEventListener('touchend', handleMouseLeave);
    }
    
    const scroll = () => {
      if (isPausedRef.current) return;
      
      if (!element) return;
      
      // Apply the scroll
      element.scrollLeft += scrollAmount;
      
      if (reverseOnEdges) {
        // Check if we've reached the edges
        const maxScrollLeft = element.scrollWidth - element.clientWidth;
        
        if (element.scrollLeft >= maxScrollLeft - 1 && directionRef.current === 'right') {
          // At right edge, reverse direction
          scrollAmount = -speed;
          directionRef.current = 'left';
        } else if (element.scrollLeft <= 0 && directionRef.current === 'left') {
          // At left edge, reverse direction
          scrollAmount = speed;
          directionRef.current = 'right';
        }
      }
    };
    
    const intervalId = setInterval(scroll, interval);
    
    return () => {
      clearInterval(intervalId);
      
      if (pauseOnHover) {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
        element.removeEventListener('touchstart', handleMouseEnter);
        element.removeEventListener('touchend', handleMouseLeave);
      }
    };
  }, [elementId, speed, interval, direction, pauseOnHover, reverseOnEdges]);
}
