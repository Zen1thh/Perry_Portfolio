import React, { useRef, useState, useLayoutEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  // 1. Setup scroll physics
  // We intercept the native scroll position
  const { scrollY } = useScroll();
  
  // 2. Create a spring that follows the scroll position with lag
  // Adjusting these values changes the "weight" of the scroll
  const springConfig = { 
    damping: 25,  // Higher damping = less oscillation (bounciness)
    mass: 0.1,    // Lower mass = faster initial response
    stiffness: 120 // Higher stiffness = follows closer to target
  };
  
  const springY = useSpring(scrollY, springConfig);
  
  // 3. Transform vertical position: When we scroll down (positive Y),
  // we move the content up (negative Y)
  const y = useTransform(springY, (value) => -value);

  // 4. Measure content height to stretch the body
  // This allows the native scrollbar to work correctly
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (contentRef.current) {
        setContentHeight(contentRef.current.scrollHeight);
      }
    };

    // Initial measure
    handleResize();
    
    // Observe changes to the content size
    const resizeObserver = new ResizeObserver(handleResize);
    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [children]);

  return (
    <>
      {/* 
         The Fixed Container that holds the actual site content.
         It moves smoothly via the 'y' transform.
         z-0 ensures it sits above the background but doesn't trap fixed elements if z-indexes are managed.
      */}
      <motion.div
        ref={contentRef}
        style={{ y }}
        className="fixed top-0 left-0 w-full overflow-hidden will-change-transform z-0"
      >
        {children}
      </motion.div>
      
      {/* 
         Ghost element to force the browser to show a scrollbar 
         of the correct height.
      */}
      <div style={{ height: contentHeight }} />
    </>
  );
};

export default SmoothScroll;