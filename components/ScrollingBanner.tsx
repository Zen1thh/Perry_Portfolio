import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const ScrollingBanner: React.FC = () => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      // Slower animation for larger text to feel more weighty/cinematic
      const animationDuration = 60;
      
      gsap.to(textRef.current, {
        xPercent: -50,
        duration: animationDuration,
        ease: "linear",
        repeat: -1
      });
    }
  }, []);

  const content = "FULL-STACK DEVELOPER — FRONT END DEVELOPER — BACKEND DEVELOPER — UI/UX DESIGNER — AI PROMPT ENGINEER — EMBEDDED SYSTEM DEVELOPER";
  // Repeat fewer times since text is larger
  const repeatedContent = Array(4).fill(content).join("");

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="w-full h-full flex items-center overflow-hidden pointer-events-none"
    >
      <div className="w-full flex whitespace-nowrap">
        <div ref={textRef} className="flex will-change-transform">
            {/* Updated to Inter Light for a thinner, minimalist aesthetic */}
            <span className="text-2xl md:text-4xl font-light font-inter tracking-widest text-white/10 uppercase px-4 select-none">
                {repeatedContent}
            </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ScrollingBanner;