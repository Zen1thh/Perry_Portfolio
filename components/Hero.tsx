
import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import gsap from 'gsap';

// --- Magnetic Button Component ---
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({ children, className, href, onClick }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const xPos = clientX - (left + width / 2);
    const yPos = clientY - (top + height / 2);
    x.set(xPos * 0.3); // Magnetic strength
    y.set(yPos * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: mouseX, y: mouseY }}
      className={`relative inline-flex items-center justify-center cursor-pointer ${className}`}
    >
      {children}
    </motion.a>
  );
};

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // PERFORMANCE OPTIMIZATION: 
  // Using useMotionValue instead of useState prevents re-renders on every mouse move.
  const mouseX = useMotionValue(-1000); // Start off-screen
  const mouseY = useMotionValue(-1000);

  // Add spring physics for silky smooth 60fps tracking
  const springConfig = { damping: 20, stiffness: 300, mass: 0.1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Construct the clip-path string directly from motion values
  const clipPath = useMotionTemplate`circle(250px at ${smoothX}px ${smoothY}px)`;

  // Parallax Exit Animation
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 700], [1, 0]);
  const scale = useTransform(scrollY, [0, 700], [1, 0.8]);
  const blur = useTransform(scrollY, [0, 700], [0, 10]);
  const contentY = useTransform(scrollY, [0, 700], [0, 100]);

  // Detect Mobile/Tablet
  useEffect(() => {
    const checkMobile = () => {
      // Check for touch capability or small screen width (standard tablet breakpoint < 1024px)
      const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      const isSmallScreen = window.innerWidth < 1024;
      setIsMobile(isTouch || isSmallScreen);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle Mouse/Touch Movement Logic
  useEffect(() => {
    // Desktop: Track Mouse
    if (!isMobile) {
      const handleMouseMove = (e: MouseEvent) => {
        // Directly update motion values (does not trigger React commit phase)
        if (textWrapperRef.current) {
          const rect = textWrapperRef.current.getBoundingClientRect();
          mouseX.set(e.clientX - rect.left);
          mouseY.set(e.clientY - rect.top);
        }
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    } 
    
    // Mobile/Tablet: Automated Wandering
    else {
      let ctx: gsap.Context;
      
      // Wait a bit for layout to settle
      const timeoutId = setTimeout(() => {
        if (!textWrapperRef.current) return;
        
        const rect = textWrapperRef.current.getBoundingClientRect();
        // Initial position center
        mouseX.set(rect.width / 2);
        mouseY.set(rect.height / 2);
        
        const proxy = { x: rect.width / 2, y: rect.height / 2 };

        const randomMove = () => {
            if (!textWrapperRef.current) return;
            const currentRect = textWrapperRef.current.getBoundingClientRect();
            
            // Pick a random spot within the text area
            const targetX = Math.random() * currentRect.width;
            const targetY = Math.random() * currentRect.height;
            
            // Random duration for organic feel
            const duration = Math.random() * 1.5 + 1.5; // 1.5s to 3s

            gsap.to(proxy, {
                x: targetX,
                y: targetY,
                duration: duration,
                ease: "sine.inOut", // Smooth wave-like movement
                onUpdate: () => {
                   mouseX.set(proxy.x);
                   mouseY.set(proxy.y);
                },
                onComplete: randomMove
            });
        };

        // Start the loop
        ctx = gsap.context(() => {
            randomMove();
        });
      }, 100);

      return () => {
        clearTimeout(timeoutId);
        if (ctx) ctx.revert();
      };
    }
  }, [isMobile, mouseX, mouseY]);

  const handleScrollToWorks = (e: React.MouseEvent) => {
    e.preventDefault();
    const worksSection = document.getElementById('works');
    if (worksSection) {
      const top = worksSection.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: 'instant' });
    }
  };

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden px-4 pt-32"
    >
      {/* Grid Decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <motion.div 
        className="relative z-10 w-full max-w-7xl mx-auto"
        style={{ opacity, scale, filter: useMotionTemplate`blur(${blur}px)`, y: contentY }}
      >
        
        {/* --- MAIN CONTENT WRAPPER --- */}
        <div ref={textWrapperRef} className="relative">
          
          {/* Layer 1: Dim/Outlined Text (Always Visible) */}
          <div className="text-center select-none">
             {/* Row 1 */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-12 mb-2 md:mb-6">
              <motion.span 
                initial={{ opacity: 0, x: -50 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.2 }}
                className="font-serif italic text-xl md:text-2xl lg:text-3xl text-gray-600"
              >
                Forging
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold font-syne text-transparent stroke-text opacity-30"
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}
              >
                DIGITAL
              </motion.h1>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-12">
              <motion.h1 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold font-syne text-transparent stroke-text opacity-30"
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.5)' }}
              >
                REALITY
              </motion.h1>
              <motion.span 
                 initial={{ opacity: 0, x: 50 }} 
                 animate={{ opacity: 1, x: 0 }} 
                 transition={{ delay: 0.4 }}
                 className="font-serif italic text-xl md:text-2xl lg:text-3xl text-gray-600"
              >
                With Code
              </motion.span>
            </div>
          </div>

          {/* Layer 2: Spotlight/Filled Text (Revealed by ClipPath) */}
          <motion.div 
            className="absolute inset-0 text-center pointer-events-none select-none"
            style={{
              clipPath: clipPath,
              WebkitClipPath: clipPath,
              // Removed manual CSS transition as useSpring handles smoothing now
            }}
          >
            {/* Duplicate Structure for Perfect Alignment */}
            {/* Row 1 */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-12 mb-2 md:mb-6">
              <motion.span 
                initial={{ opacity: 0, x: -50 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.2 }}
                className="font-serif italic text-xl md:text-2xl lg:text-3xl text-white"
              >
                Forging
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold font-syne text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              >
                DIGITAL
              </motion.h1>
            </div>

            {/* Row 2 */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-12">
              <motion.h1 
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold font-syne text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
              >
                REALITY
              </motion.h1>
              <motion.span 
                 initial={{ opacity: 0, x: 50 }} 
                 animate={{ opacity: 1, x: 0 }} 
                 transition={{ delay: 0.4 }}
                 className="font-serif italic text-xl md:text-2xl lg:text-3xl text-white"
              >
                With Code
              </motion.span>
            </div>
          </motion.div>

        </div>

        {/* --- CTA --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-24 flex justify-center"
        >
          <MagneticButton 
            href="#works" 
            onClick={handleScrollToWorks}
            className="group relative w-40 h-40 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-colors"
          >
            <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-all duration-500 scale-0 group-hover:scale-100" />
            <div className="flex flex-col items-center gap-2 z-10">
              <span className="text-xs font-bold tracking-widest text-gray-300 group-hover:text-white">VIEW WORK</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" height="24" viewBox="0 0 24 24" 
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="group-hover:translate-y-1 transition-transform duration-300"
              >
                <path d="M12 5v14" /><path d="m19 12-7 7-7-7" />
              </svg>
            </div>
          </MagneticButton>
        </motion.div>

        {/* --- DECORATIONS --- */}
        <div className="absolute bottom-0 left-0 p-8 hidden md:block">
          <div className="text-xs text-gray-500 tracking-widest font-mono space-y-1">
            <p>LOC: 14.5995° N, 120.9842° E</p>
            <div className="flex items-center gap-2">
               <div className="relative flex h-2 w-2">
                  <motion.span 
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"
                  />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
               </div>
               <span>STATUS: OPEN FOR INTERNSHIP</span>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 p-8 hidden md:block">
          <p className="text-xs text-gray-500 tracking-widest font-mono text-right">
            EST. 2025<br/>
            V 9.9.9
          </p>
        </div>

      </motion.div>
    </section>
  );
};

export default Hero;
