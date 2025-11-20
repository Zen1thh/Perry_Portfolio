import React, { useRef } from 'react';
import {
  motion,
  useTransform,
  useMotionValue,
  useAnimationFrame
} from 'framer-motion';
import gsap from 'gsap';

// Updated list
const techStack = [
  "Python", "Javascript", "Typescript", "Dart", "React", "Next.js",
  "Tailwind", "HTML", "CSS", "PHP", "Supabase", "Vercel", "Netlify"
];

// Logo URLs (using Devicon CDN for high-quality vector logos)
const techLogos: Record<string, string> = {
  "Python": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
  "Javascript": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  "Typescript": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  "Dart": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg",
  "React": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  "Next.js": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  "Tailwind": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  "HTML": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
  "CSS": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
  "PHP": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg",
  "Supabase": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg",
  "Vercel": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg",
  "Netlify": "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/netlify/netlify-original.svg"
};

// Utility for wrapping logic to create infinite loops
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface ParallaxProps {
  children: React.ReactNode;
  baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0);

  /**
   * Wrapping Logic:
   * We assume the content is repeated 4 times. 
   * Moving from 0% to -25% creates a seamless loop.
   */
  const x = useTransform(baseX, (v) => `${wrap(0, -25, v)}%`);

  useAnimationFrame((t, delta) => {
    // Constant movement - removed velocity/skew logic
    const moveBy = baseVelocity * (delta / 1000);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap py-8 md:py-12 select-none">
      <motion.div
        className="flex flex-nowrap whitespace-nowrap gap-12 md:gap-24"
        style={{ x }}
      >
        {/* Repeat children 4 times for seamless loop */}
        {[...Array(4)].map((_, i) => (
           <div key={i} className="flex gap-12 md:gap-24 px-6 md:px-12">
             {children}
           </div>
        ))}
      </motion.div>
    </div>
  );
}

const TechItem = ({ text }: { text: string }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const sepRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLImageElement>(null);

  // Next.js and Vercel logos are black, so they need inversion on dark background
  const needsInversion = text === "Next.js" || text === "Vercel";

  const handleMouseEnter = () => {
    if (textRef.current) {
      // Fill effect
      gsap.to(textRef.current, {
        color: "#ffffff",
        webkitTextStroke: "0px transparent",
        scale: 1.1,
        textShadow: "0 0 20px rgba(255,255,255,0.5)",
        duration: 0.3,
        ease: "power2.out"
      });
    }
    if (iconRef.current) {
      // Icon glow effect for images
      gsap.to(iconRef.current, {
        opacity: 1,
        scale: 1.2,
        // Restore color and add glow. Next.js needs inversion to be visible on black.
        filter: needsInversion 
            ? "invert(1) grayscale(0%) drop-shadow(0 0 10px rgba(255,255,255,0.6))" 
            : "grayscale(0%) drop-shadow(0 0 10px rgba(255,255,255,0.6))",
        duration: 0.3,
        ease: "power2.out"
      });
    }
    if (sepRef.current) {
      gsap.to(sepRef.current, {
        rotate: 180,
        color: "#22d3ee", // Cyan
        scale: 1.5,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
    }
  };

  const handleMouseLeave = () => {
    if (textRef.current) {
      // Return to outline
      gsap.to(textRef.current, {
        color: "transparent",
        webkitTextStroke: "1px rgba(255,255,255,0.5)",
        scale: 1,
        textShadow: "none",
        duration: 0.3,
        ease: "power2.out"
      });
    }
    if (iconRef.current) {
      // Return to dim grayscale state
      gsap.to(iconRef.current, {
        opacity: 0.5,
        scale: 1,
        filter: needsInversion ? "invert(1) grayscale(100%)" : "grayscale(100%)",
        duration: 0.3,
        ease: "power2.out"
      });
    }
    if (sepRef.current) {
      gsap.to(sepRef.current, {
        rotate: 0,
        color: "#4b5563", // Gray-600
        scale: 1,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };

  const logoUrl = techLogos[text];

  return (
    <div 
      className="group flex items-center gap-12 md:gap-24"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Container for Icon + Text Row */}
      <div className="flex flex-row items-center justify-center gap-6 md:gap-8">
        {/* Icon Image */}
        <img 
          ref={iconRef}
          src={logoUrl}
          alt={`${text} logo`}
          className="w-10 h-10 md:w-14 md:h-14 object-contain opacity-50 will-change-transform"
          style={{ 
            filter: needsInversion ? "invert(1) grayscale(100%)" : "grayscale(100%)" 
          }}
        />

        {/* Text */}
        <span 
          ref={textRef}
          className="text-4xl md:text-7xl font-bold font-syne uppercase text-transparent transition-all will-change-transform"
          style={{ WebkitTextStroke: '1px rgba(255, 255, 255, 0.5)' }}
        >
          {text}
        </span>
      </div>
      
      {/* Formal Geometric Separator */}
      <span 
        ref={sepRef}
        className="text-xl md:text-3xl text-gray-600 flex items-center justify-center"
      >
        ❖
      </span>
    </div>
  );
};

const TechStack: React.FC = () => {
  return (
    <section className="py-16 bg-black border-y border-white/5 overflow-hidden relative z-10">
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 opacity-[0.03]" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', 
             backgroundSize: '40px 40px' 
           }} 
      />

      <div className="mb-10 text-center relative z-10">
         <motion.div 
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            whileInView={{ opacity: 1, letterSpacing: "0.4em" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="inline-block"
         >
            <span className="text-xs font-bold text-gray-500 uppercase border-b border-white/10 pb-2">
                Technical Arsenal
            </span>
         </motion.div>
      </div>

      <div className="relative">
        {/* Vignettes for depth */}
        <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-black to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-black to-transparent z-20 pointer-events-none" />

        {/* Single Formal Stream - Constant velocity */}
        <ParallaxText baseVelocity={-0.85}>
          {techStack.map((tech) => (
            <TechItem key={tech} text={tech} />
          ))}
        </ParallaxText>
      </div>
    </section>
  );
};

export default TechStack;