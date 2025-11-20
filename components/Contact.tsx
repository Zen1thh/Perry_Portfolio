import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { IconGithub, IconLinkedin, IconFacebook, IconFileText } from './Icons';
import ResumeModal from './ResumeModal';

// --- Contact Button Sub-Component ---
interface ContactButtonProps {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
}

const ContactButton: React.FC<ContactButtonProps> = ({ icon: Icon, label, href, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

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

  // GSAP Text Scramble Effect
  useEffect(() => {
    if (isHovered && textRef.current && !isMobile) {
      const originalText = label;
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*";
      
      gsap.killTweensOf(textRef.current);
      
      const progress = { value: 0 };
      
      gsap.to(progress, {
        value: 1,
        duration: 0.5,
        ease: "power2.out",
        onUpdate: () => {
          if (!textRef.current) return;
          const p = progress.value;
          const len = originalText.length;
          const scrambled = originalText.split('').map((char, i) => {
            // Reveal character based on progress
            if (i < p * len) return char;
            return chars[Math.floor(Math.random() * chars.length)];
          }).join('');
          textRef.current.innerText = scrambled;
        },
        onComplete: () => {
          if (textRef.current) textRef.current.innerText = originalText;
        }
      });
    }
  }, [isHovered, label, isMobile]);

  // Dynamically choose element type based on props
  const Component = href ? motion.a : motion.button;

  return (
    <Component
      href={href}
      onClick={onClick}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      className="relative flex items-center h-16 rounded-full border border-white/10 bg-black overflow-hidden cursor-pointer group"
      initial={{ backgroundColor: "rgba(0,0,0,1)" }}
      // Only enable hover background change on non-mobile
      whileHover={!isMobile ? { 
        backgroundColor: "rgba(255,255,255,1)", 
        borderColor: "rgba(255,255,255,1)" 
      } : {}}
      // Enable tap scale on mobile for feedback
      whileTap={isMobile ? { scale: 0.95 } : {}}
      transition={{ duration: 0.3 }}
      onHoverStart={() => !isMobile && setIsHovered(true)}
      onHoverEnd={() => !isMobile && setIsHovered(false)}
      aria-label={label}
    >
      {/* Icon Container - Fixed Width */}
      <div className="w-16 h-16 flex items-center justify-center shrink-0 z-10">
        <Icon className={`w-6 h-6 transition-colors duration-300 ${isHovered && !isMobile ? 'text-black' : 'text-white'}`} />
      </div>

      {/* Expanding Text Container */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ 
          width: isHovered && !isMobile ? "auto" : 0, 
          opacity: isHovered && !isMobile ? 1 : 0 
        }}
        transition={{ 
          width: { type: "spring", stiffness: 300, damping: 30 },
          opacity: { duration: 0.2, delay: 0.1 } 
        }}
        className="overflow-hidden whitespace-nowrap"
      >
        <span 
          ref={textRef}
          className="block pr-8 text-black font-bold font-syne uppercase tracking-widest text-sm"
        >
          {label}
        </span>
      </motion.div>
    </Component>
  );
};

const Contact: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  
  // Track scroll progress relative to the footer container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // Create layered parallax effects
  const titleY = useTransform(scrollYProgress, [0, 1], [-50, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [-30, 0]);
  const iconsY = useTransform(scrollYProgress, [0, 1], [-15, 0]);

  // Background parallax text
  const bgTextY = useTransform(scrollYProgress, [0, 1], [100, -100]);

  // Smooth fade-in as the footer enters the viewport
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <footer id="contact" ref={containerRef} className="relative bg-black pt-32 pb-12 overflow-hidden">
      {/* Background Parallax Text */}
      <motion.div 
        style={{ y: bgTextY }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] md:text-[18rem] font-bold font-syne text-white/[0.02] pointer-events-none whitespace-nowrap select-none z-0"
      >
        CONTACT
      </motion.div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      <div className="container mx-auto px-4 text-center z-10 relative">
        <motion.div style={{ y: titleY, opacity }}>
          <h2 className="text-4xl md:text-6xl font-bold font-syne uppercase tracking-tight mb-8">
            Let's collaborate and<br />bring your ideas to life.
          </h2>
        </motion.div>
        
        <motion.p 
          style={{ y: textY, opacity }}
          className="text-gray-500 text-sm tracking-[0.2em] mb-12"
        >
          REACH OUT THROUGH ANY OF THESE CHANNELS
        </motion.p>

        <motion.div 
          style={{ y: iconsY, opacity }}
          className="flex flex-wrap justify-center gap-4 md:gap-6 mb-24"
        >
          <ContactButton 
            icon={IconFacebook} 
            label="Facebook" 
            href="https://www.facebook.com/Zen1th.GG" 
          />
          <ContactButton 
            icon={IconLinkedin} 
            label="LinkedIn" 
            href="https://www.linkedin.com/in/perry-uy-456931252" 
          />
          <ContactButton 
            icon={IconGithub} 
            label="GitHub" 
            href="https://github.com/Zen1thh" 
          />
          <ContactButton 
            icon={IconFileText} 
            label="View Resume" 
            onClick={() => setIsResumeOpen(true)} 
          />
        </motion.div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <p>&copy; 2025 All Rights Reserved.</p>
          <p className="mt-2 md:mt-0">Designed & Developed by Perry Uy.</p>
        </div>
      </div>

      {/* Resume Modal Component */}
      <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
    </footer>
  );
};

export default Contact;