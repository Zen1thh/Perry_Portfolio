import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import ScrollingBanner from './ScrollingBanner';

const NavItem = ({ href, text }: { href: string; text: string }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    
    if (textRef.current) {
      const originalText = text;
      // Characters to use for scrambling
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&*";
      const duration = 0.4;
      
      // Kill any ongoing animations to avoid conflicts
      gsap.killTweensOf(textRef.current);

      // Use a proxy object to animate the 'progress' of the text reveal
      const progressObj = { value: 0 };
      
      gsap.to(progressObj, {
        value: originalText.length,
        duration: duration,
        ease: "none",
        onUpdate: () => {
          if (!textRef.current) return;
          
          const progress = Math.floor(progressObj.value);
          
          textRef.current.innerText = originalText
            .split("")
            .map((originalChar, index) => {
              // If we've passed this index, show the real character
              if (index < progress) {
                return originalChar;
              }
              // Otherwise show a random character
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");
        },
        onComplete: () => {
          // Ensure the final text is clean
          if (textRef.current) textRef.current.innerText = originalText;
        }
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    // Stop animation if mouse leaves quickly
    if (textRef.current) {
        gsap.killTweensOf(textRef.current);
        textRef.current.innerText = text;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const elem = document.getElementById(targetId);
    if (elem) {
      // Calculate absolute position including current scroll
      const top = elem.getBoundingClientRect().top + window.scrollY;
      // We use 'instant' behavior because SmoothScroll component's spring will handle the visual interpolation
      window.scrollTo({ top, behavior: 'instant' });
    }
  };

  return (
    <a 
      href={href} 
      onClick={handleClick}
      className="group flex items-center gap-0.5 md:gap-1 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.span 
        animate={{ x: isHovered ? -3 : 0, opacity: isHovered ? 0.5 : 1 }}
        transition={{ duration: 0.3, ease: "circOut" }}
        className="text-white/80 inline-block"
      >
        [
      </motion.span>
      
      <span 
        ref={textRef} 
        className="text-white group-hover:text-gray-300 transition-colors duration-300 inline-block whitespace-nowrap"
      >
        {text}
      </span>
      
      <motion.span 
        animate={{ x: isHovered ? 3 : 0, opacity: isHovered ? 0.5 : 1 }}
        transition={{ duration: 0.3, ease: "circOut" }}
        className="text-white/80 inline-block"
      >
        ]
      </motion.span>
    </a>
  );
};

const Navbar: React.FC = () => {
  return (
    <nav
      className="absolute top-0 left-0 w-full z-40 h-24 flex items-center justify-center border-b border-white/5 bg-black/10 backdrop-blur-xl overflow-hidden transition-all duration-300"
    >
      {/* Background Scrolling Banner - Positioned Absolute/Behind */}
      <div className="absolute inset-0 flex items-center justify-center z-0 select-none pointer-events-none">
         <ScrollingBanner />
      </div>

      {/* Foreground Content */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex justify-between sm:justify-center items-center relative z-10">
        {/* Logo - Responsive positioning and sizing */}
        <div className="font-bold text-lg sm:text-xl tracking-tighter font-syne sm:absolute sm:left-6 md:left-12 text-white">
        
        </div>
        
        {/* Navigation - Visible on all devices, scaled for mobile */}
        <div className="flex gap-3 sm:gap-6 md:gap-8 text-[9px] sm:text-[10px] md:text-xs font-bold tracking-widest items-center">
            <NavItem href="#about" text="ABOUT ME" />
            <NavItem href="#works" text="WORKS" />
            <NavItem href="#contact" text="CONNECT" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;