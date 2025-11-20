
import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useInView } from 'framer-motion';
import gsap from 'gsap';

const projects = [
  {
    id: 1,
    title: "Arya Kopi - Inventory & POS System",
    category: "Full Stack Developer",
    image: "/pos-image.png",
    link: "https://github.com/Zen1thh/WiseGuys_Capstone/tree/dev-with-DB",
    year: "2024",
    description: "A comprehensive solution streamlining sales and stock management for coffee shop operations.",
    stack: ["Flutter", "Dart", "Supabase", "Netlify"],
    glowColors: ["#f97316", "#c2410c"] // Orange
  },
  {
    id: 2,
    title: "Portfolio Website with Login System",
    category: "Full Stack Developer",
    image: "/portfolio-image.png",
    link: "https://github.com/Zen1thh/Perry-s-Profile-Website-V2",
    year: "2024",
    description: "Modern personal portfolio featuring secure authentication and dynamic content management.",
    stack: ["HTML", "CSS", "JavaScript", "PHP"],
    glowColors: ["#06b6d4", "#3b82f6"] // Cyan/Blue
  },
  {
    id: 3,
    title: "Rizal's Mi Ultimo Adios - Educational Website",
    category: "Front End Developer",
    image: "/rizal-image.png",
    link: "https://github.com/Zen1thh/Rizlife-finals/tree/Cloudflare",
    year: "2024",
    description: "Interactive platform exploring the historical significance of Rizal's final poem.",
    stack: ["Flutter", "Dart", "Netlify"],
    glowColors: ["#8b5cf6", "#6366f1"] // Violet/Indigo
  },
  {
    id: 4,
    title: "PATHLINK - IoT Car Rental Management System",
    category: "Backend Developer & Hardware-Software Integration Lead",
    image: "/pathlink-image.png",
    link: "https://github.com/lucasram20/PathLink/tree/main",
    year: "2025",
    description: "Smart rental platform with real-time GPS tracking and automated fleet management.",
    stack: ["Next.js", "React", "Tailwind", "Supabase", "Netlify"],
    glowColors: ["#ec4899", "#db2777"] // Pink
  }
];

// --- TechBadge Component ---
interface TechBadgeProps {
  text: string;
}

const TechBadge: React.FC<TechBadgeProps> = ({ text }) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
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
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      // Increased size to match About section pills
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
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 25 
      }}
    >
      <span ref={textRef} className="relative z-10 font-bold tracking-wider font-mono">
        {text}
      </span>
    </motion.div>
  );
};

// --- Project Title with Scroll Effect ---
const ProjectTitle: React.FC<{ title: string }> = ({ title }) => {
  const ref = useRef<HTMLHeadingElement>(null);
  
  // Start reveals when element is at 90% of viewport, complete at 50%
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "center 50%"] 
  });
  
  const percentage = useTransform(scrollYProgress, [0, 1], [0, 100]);
  // Using semi-transparent white for the 'unrevealed' part to make it subtle but visible against black bg
  const gradient = useMotionTemplate`linear-gradient(90deg, #ffffff ${percentage}%, rgba(255,255,255,0.15) ${percentage}%)`;

  return (
    <motion.h3
      ref={ref}
      className="text-3xl md:text-4xl font-bold font-syne uppercase"
      style={{
        backgroundImage: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        display: 'inline-block'
      }}
    >
      {title}
    </motion.h3>
  );
};

// --- Project Card Component ---
const ProjectCard = ({ project }: { project: typeof projects[0] }) => {
  const cardRef = useRef(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // UseInView defaults to repeatedly checking visibility (once: false by default in this hook version)
  const isInCenter = useInView(cardRef, { margin: "-40% 0px -40% 0px" });
  
  useEffect(() => {
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        backgroundPosition: "200% center",
        duration: 8,
        ease: "none",
        repeat: -1
      });
    }
  }, []);

  const animateState = isHovered || isInCenter ? "hover" : "visible";

  return (
    <motion.div 
      ref={cardRef}
      className="w-full md:w-3/5 group relative z-10 cursor-pointer"
      initial="rest"
      animate={animateState}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        ref={glowRef}
        className="absolute -inset-1 rounded-2xl -z-10"
        style={{
          background: `linear-gradient(90deg, ${project.glowColors[0]}, ${project.glowColors[1]}, ${project.glowColors[0]})`,
          backgroundSize: "200% 100%"
        }}
        variants={{
          rest: { 
            opacity: 0,
            filter: "blur(10px)",
            scale: 0.95
          },
          visible: {
            opacity: 0.35,
            filter: "blur(25px)",
            scale: 0.98,
            transition: { duration: 0.8, ease: "easeOut" }
          },
          hover: { 
            opacity: 0.7, 
            filter: "blur(45px)",
            scale: 1.03,
            transition: { duration: 0.3, ease: "easeOut" }
          }
        }}
      />

      <a 
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <motion.div 
          className="relative overflow-hidden rounded-2xl glass-panel border transition-all duration-500"
          variants={{
            rest: { borderColor: "rgba(255,255,255,0.05)" },
            visible: { borderColor: "rgba(255,255,255,0.05)" },
            hover: { borderColor: "rgba(255,255,255,0.2)" }
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 z-10 pointer-events-none" />
          
          <motion.img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-[300px] md:h-[450px] object-cover"
            variants={{
              rest: { scale: 1 },
              visible: { scale: 1 },
              hover: { scale: 1.05, transition: { duration: 0.7, ease: "easeOut" } }
            }}
          />
        </motion.div>
      </a>
    </motion.div>
  );
};

const Projects: React.FC = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: titleRef,
    offset: ["start 80%", "center 55%"]
  });
  const titlePercentage = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const titleGradient = useMotionTemplate`linear-gradient(90deg, #ffffff ${titlePercentage}%, rgba(255,255,255,0.15) ${titlePercentage}%)`;

  return (
    <section id="works" className="py-32 px-4 md:px-12 max-w-7xl mx-auto">
      <div className="text-center mb-32">
        <motion.h2 
          ref={titleRef}
          style={{ 
            backgroundImage: titleGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
          className="text-5xl md:text-8xl font-bold mb-6 inline-block font-syne tracking-tighter"
        >
          SELECTED WORKS
        </motion.h2>
        <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base tracking-wide">
          A curated selection of projects where code meets creativity, pushing the boundaries of web performance and aesthetics.
        </p>
      </div>

      <div className="space-y-40">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            // CHANGED: once: false allows the animation to replay when scrolling back
            viewport={{ once: false, margin: "-15%" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center`}
          >
            
            <ProjectCard project={project} />

            {/* Content */}
            <div className="w-full md:w-2/5 space-y-8">
              <div className="border-b border-white/10 pb-6">
                <div className="flex items-center gap-4 mb-2">
                    <span className="text-xs font-mono text-gray-500">0{index + 1}</span>
                    <ProjectTitle title={project.title.split(" - ")[0]} />
                </div>
                <p className="text-gray-500 text-xs uppercase tracking-[0.2em]">{project.category}</p>
              </div>
              
              <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                {project.description}
              </p>

              <div className="flex justify-between items-end pt-4">
                 <div>
                    <span className="block text-[10px] text-gray-500 mb-3 uppercase tracking-widest">Technologies</span>
                    <div className="flex flex-wrap gap-2">
                        {project.stack.map(tech => (
                            <TechBadge key={tech} text={tech} />
                        ))}
                    </div>
                 </div>
                 <div className="text-right">
                    <span className="block text-[10px] text-gray-500 mb-1 uppercase tracking-widest">Year</span>
                    <span className="text-lg font-bold font-syne">{project.year}</span>
                 </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
