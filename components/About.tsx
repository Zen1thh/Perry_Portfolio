
import React, { useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import gsap from 'gsap';

const characteristics = [
  "Friendly",
  "Proactive",
  "Solution-Oriented",
  "Versatile",
  "Adaptable",
  "Organized",
  "Continuous Learner"
];

// --- ParallaxRevealImage Component ---
const ParallaxRevealImage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const isInView = useInView(containerRef, { once: false, margin: "-10%" });

  // Scroll based animation for the light effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center", "end start"]
  });

  // Opacity peaks at center of viewport
  const lightOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);
  const lightScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.8]);
  const lightRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <div className="relative w-full aspect-[3/4] md:aspect-[4/5] group perspective-1000">
      {/* --- SCROLL-DRIVEN LIGHT EFFECTS --- */}
      <div className="absolute inset-0 flex items-center justify-center z-[-1] pointer-events-none overflow-visible">
        <motion.div
          className="absolute w-[120%] h-[120%] rounded-full bg-gradient-to-tr from-cyan-500/40 via-blue-600/30 to-transparent"
          style={{ opacity: lightOpacity, scale: lightScale }}
          animate={{
            filter: [
              "blur(60px) hue-rotate(0deg)",
              "blur(60px) hue-rotate(360deg)"
            ]
          }}
          transition={{
            duration: 8,
            ease: "linear",
            repeat: Infinity
          }}
        />
        <motion.div
          className="absolute w-[100%] h-[100%] rounded-full bg-gradient-to-bl from-purple-600/30 to-transparent"
          style={{ opacity: lightOpacity, scale: lightScale, rotate: lightRotate }}
          animate={{
            filter: [
              "blur(50px) hue-rotate(0deg)",
              "blur(50px) hue-rotate(-360deg)"
            ]
          }}
          transition={{
            duration: 10,
            ease: "linear",
            repeat: Infinity
          }}
        />
      </div>

      {/* --- MAIN IMAGE CONTAINER --- */}
      <div 
        ref={containerRef}
        className="relative w-full h-full rounded-sm overflow-hidden bg-gray-900 border border-white/10 transition-colors duration-500 shadow-2xl"
      >
        <div className="absolute inset-0 overflow-hidden">
           <motion.img 
             src="/profile-image.jpg" 
             alt="Perry - Creative Developer"
             className="w-full h-full object-cover"
             initial={{ scale: 1.4, filter: "grayscale(100%) blur(8px)" }}
             animate={isInView ? { scale: 1, filter: "grayscale(0%) blur(0px)" } : { scale: 1.4, filter: "grayscale(100%) blur(8px)" }}
             transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
           
           <motion.div 
             className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent mix-blend-overlay pointer-events-none" 
             style={{ opacity: lightOpacity }}
           />
        </div>

        {/* Formal Shutter Reveal Animation */}
        <div className="absolute inset-0 flex flex-col z-20 pointer-events-none">
           {[...Array(6)].map((_, i) => (
              <motion.div
                 key={i}
                 className="flex-1 w-full bg-[#050505] relative border-b border-white/5 last:border-none"
                 initial={{ x: 0 }}
                 animate={isInView ? { x: i % 2 === 0 ? "100%" : "-100%" } : { x: 0 }}
                 transition={{ duration: 1.2, ease: [0.8, 0, 0.2, 1], delay: i * 0.06 }}
              >
                  <div className={`absolute top-0 ${i % 2 === 0 ? 'left-0' : 'right-0'} w-1 h-full bg-white/20`} />
              </motion.div>
           ))}
        </div>

        <motion.div 
          className="absolute inset-4 border border-white/10 z-30 pointer-events-none"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.05 }}
          transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
        />
        
        <motion.div 
           className="absolute bottom-8 left-8 z-30"
           initial={{ opacity: 0, y: 20 }}
           animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
           transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
        >
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 transition-colors duration-300">
               <span className="text-xs font-syne font-bold tracking-[0.2em] uppercase text-white">
                  Perry / Creative Dev
               </span>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

// Sub-component for the unique hover animation
interface CharacteristicPillProps {
  text: string;
  index: number;
  setRef: (el: HTMLDivElement | null) => void;
}

const CharacteristicPill: React.FC<CharacteristicPillProps> = ({ text, index, setRef }) => {
  const textRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    if (textRef.current) {
      const originalText = text;
      const chars = "A1B2C3D4E5F6G7H8I9J0K!@#$%^&*";
      
      gsap.killTweensOf(textRef.current);
      const progress = { value: 0 };

      gsap.to(progress, {
        value: 1,
        duration: 0.4,
        ease: "power2.out",
        onUpdate: () => {
          if (!textRef.current) return;
          const p = progress.value;
          const len = originalText.length;
          const scrambled = originalText.split('').map((char, i) => {
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
  };

  return (
    <div ref={setRef} className="opacity-0">
      <motion.div
        onMouseEnter={handleMouseEnter}
        className="relative px-4 py-2 rounded-full text-xs md:text-sm cursor-pointer overflow-hidden inline-block border"
        initial={{ 
          backgroundColor: "rgba(255, 255, 255, 0.03)", 
          borderColor: "rgba(255, 255, 255, 0.1)",
          color: "#9ca3af" 
        }}
        whileHover={{ 
          backgroundColor: "#ffffff", 
          borderColor: "#ffffff",
          color: "#000000",
          scale: 1.05,
          boxShadow: "0 0 15px rgba(255,255,255,0.3)"
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <span ref={textRef} className="relative z-10 font-bold tracking-wider font-mono">
          {text}
        </span>
      </motion.div>
    </div>
  );
};

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const charRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const eduRef = useRef<HTMLDivElement>(null);
  const certRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });
  
  // Parallax for background text
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  
  // Hero to About Transition Parallax
  const { scrollY } = useScroll();
  const sectionParallaxY = useTransform(scrollY, [0, 800], [100, 0]); 

  // Scroll Reveal for Main Title
  const { scrollYProgress: titleProgress } = useScroll({
    target: titleRef,
    offset: ["start 80%", "center 55%"]
  });
  const titlePercentage = useTransform(titleProgress, [0, 1], [0, 100]);
  const titleGradient = useMotionTemplate`linear-gradient(90deg, #ffffff ${titlePercentage}%, #222222 ${titlePercentage}%)`;

  useEffect(() => {
    if (isInView) {
      // GSAP Animation for Characteristics
      const chars = charRefs.current.filter(Boolean);
      if (chars.length > 0) {
        gsap.fromTo(chars, 
          { y: 30, opacity: 0 }, 
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            ease: "power3.out", 
            stagger: 0.1,
            delay: 0.2 
          }
        );
      }

      // Animation for Education and Certifications
      if (eduRef.current && certRef.current) {
        gsap.fromTo([eduRef.current, certRef.current],
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8, 
            ease: "power3.out",
            stagger: 0.2,
            delay: 0.4 
          }
        );
      }
    } else {
      // RESET STATE when scrolled out of view
      const chars = charRefs.current.filter(Boolean);
      if (chars.length > 0) {
        gsap.set(chars, { opacity: 0, y: 30 });
      }
      if (eduRef.current && certRef.current) {
        gsap.set([eduRef.current, certRef.current], { opacity: 0, y: 30 });
      }
    }
  }, [isInView]);

  return (
    <motion.section 
      id="about" 
      ref={sectionRef} 
      className="relative py-32 bg-transparent overflow-hidden"
      style={{ y: sectionParallaxY }}
    >
      {/* Parallax Background Text */}
      <motion.div 
        style={{ y }}
        className="absolute top-20 -right-20 text-[12rem] md:text-[20rem] font-bold font-syne text-white/[0.02] pointer-events-none whitespace-nowrap select-none z-0"
      >
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Main Section Title */}
        <div className="text-center mb-20">
          <motion.h2 
            ref={titleRef}
            style={{ 
              backgroundImage: titleGradient,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            className="text-5xl md:text-7xl font-bold font-syne mb-4 inline-block"
          >
            ABOUT ME
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-1 bg-white mx-auto"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-16 items-start">
          
          {/* Image Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full md:w-1/2 relative z-10"
          >
            <ParallaxRevealImage />
          </motion.div>

          {/* Content Column */}
          <div className="w-full md:w-1/2 space-y-10">
            <div>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-lg leading-relaxed"
              >
                I am Perry Gabriel Uy, a proactive IT student pursuing a degree in Mobile and Internet Technology at National University Fairview. My passion lies in bridging the gap between innovative ideas and functional reality, transforming complex requirements into seamless digital experiences.
                <br /><br />
                Specializing in full-stack development, Cloud Infrastructure, and IoT, I deliver secure, high-performance solutions with precision and professional integrity. My disciplined approach transforms complex challenges into reliable, scalable systems. Ensuring tangible value and trust in every project.
              </motion.p>
            </div>

            {/* Characteristics */}
            <div className="pt-2">
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-6">Core Personal Characteristics</h4>
              <div className="flex flex-wrap gap-3">
                {characteristics.map((trait, index) => (
                  <CharacteristicPill 
                    key={trait} 
                    text={trait} 
                    index={index} 
                    setRef={(el) => { charRefs.current[index] = el; }} 
                  />
                ))}
              </div>
            </div>

            {/* Education & Certifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                <div ref={eduRef} className="opacity-0">
                    <h4 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-2">Education</h4>
                    <p className="text-xl font-syne font-bold text-white">Started BS-IT 2022</p>
                </div>
                <div ref={certRef} className="opacity-0">
                    <h4 className="text-xs font-bold tracking-widest uppercase text-white/50 mb-2">Certifications</h4>
                    <p className="text-xl font-syne font-bold text-white">3+</p>
                </div>
            </div>

          </div>

        </div>
      </div>
    </motion.section>
  );
};

export default About;
