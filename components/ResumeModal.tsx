import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { 
  IconX, 
  IconDownload, 
  IconMail, 
  IconMapPin, 
  IconPhone
} from './Icons';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Resume Data from PDF/OCR
  const data = {
    header: {
      name: "Perry Gabriel O. Uy",
      degree: "BS Information Technology",
      spec: "with Specialization in Mobile and Internet Technology"
    },
    contact: {
      address: "Blk 11, Lot 2D, Montville Place, Sauyo, Quezon City",
      mobile: "09291942148",
      email: "perryuy31@yahoo.com"
    },
    objective: "Seeking an internship where I can apply my specialization in mobile and internet technology to bridge the gap between innovative ideas and functional solutions, contributing to the company's growth and success.",
    projects: [
      {
        title: "Arya Kopi - Inventory & POS System",
        role: "Full Stack Developer",
        desc: "Developed an Inventory Management System with Point of Sales System for Arya Kopi."
      },
      {
        title: "Portfolio Website",
        role: "Full Stack Developer",
        desc: "Developed a responsive, portfolio website with a login system and integrated database."
      },
      {
        title: "Mi Ultimo Adios - Educational Site",
        role: "Frontend Developer",
        desc: "Developed an educational website on Rizal's \"Mi Ultimo Adios,\" presenting historical content in a user-friendly design."
      },
      {
        title: "PATHLINK - IoT Car Rental System",
        role: "Backend Developer & Integration Lead",
        desc: "Developed an IoT-Enabled Car Rental Management System with Real-Time Vehicle GPS Location Tracking."
      }
    ],
    education: [
      {
        school: "National University Fairview",
        details: "SM Fairview Complex, corner Regalado Hwy, Quezon City",
        year: "2022 - 2026 (Expected Graduation)",
        course: "BS in Information Technology (BSIT-MI)"
      },
      {
        school: "STI College Novaliches",
        details: "Green Hights Subd, Novaliches, Quezon City",
        year: "2020 - 2022",
        course: "Senior High School"
      },
      {
        school: "Holy Child Academy",
        details: "21 King Ferdinand St, Novaliches, Quezon City",
        year: "2016 - 2020",
        course: "Junior High School"
      }
    ],
    skills: [
      "Python", "Javascript", "Typescript", "Dart", "React", "Tailwind CSS", "HTML", "CSS", "PHP", "Postgre SQL"
    ],
    awards: ["First Honor Dean’s Lister A.Y 2024-2025"],
    certifications: [
      "Oracle Cloud Infrastructure Certified 2025 Foundations Associate",
      "Cisco Network Basic Certificate",
      "Salesforce for Admins Certificate 2025"
    ],
    orgs: ["Member, Codability Tech Student Organization | 2025"],
    interests: ["Learning new AI tools", "Listening to Music", "Watching Movies", "Playing Games", "Biking"]
  };

  useEffect(() => {
    if (isOpen && contentRef.current) {
      // Wait for Framer Motion to mount the DOM
      const ctx = gsap.context(() => {
        gsap.fromTo(".resume-item", 
          { y: 30, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            stagger: 0.05, 
            duration: 0.6, 
            ease: "power3.out",
            delay: 0.3 // Wait for modal pop-up
          }
        );
      }, contentRef);

      return () => ctx.revert();
    }
  }, [isOpen]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl max-h-[90vh] bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Top Bar (Actions) */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#121212]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Resume Preview</span>
              </div>
              <div className="flex items-center gap-3">
                <a 
                  href="/Uy_Resume.pdf"
                  download="Uy_Resume.pdf"
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
                >
                  <IconDownload className="w-4 h-4" />
                  <span>Download PDF</span>
                </a>
                <button 
                  onClick={onClose} 
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors ml-2"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Resume Content */}
            <div ref={contentRef} className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#0f0f0f] text-gray-300 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
              
              {/* Paper Layout */}
              <div className="max-w-4xl mx-auto bg-[#161616] p-8 md:p-12 rounded-sm shadow-lg border border-white/5 min-h-full">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start border-b-2 border-white/10 pb-8 mb-8 resume-item">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/20 bg-gray-800">
                       <img 
                         src="/resume-profile.jpg" 
                         alt="Perry Gabriel O. Uy" 
                         className="w-full h-full object-cover"
                       />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold font-syne text-white tracking-tight">{data.header.name}</h1>
                        <h2 className="text-blue-400 text-lg font-medium mt-1">{data.header.degree}</h2>
                        <p className="text-gray-500 text-sm mt-1">{data.header.spec}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                  
                  {/* LEFT COLUMN (Main Content) */}
                  <div className="md:col-span-8 space-y-10">
                    
                    {/* Objective */}
                    <section className="resume-item">
                      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 border-b border-white/10 pb-2">Objective</h3>
                      <p className="text-sm leading-relaxed text-gray-300">{data.objective}</p>
                    </section>

                    {/* Projects */}
                    <section className="resume-item">
                      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 border-b border-white/10 pb-2">Accomplished Projects</h3>
                      <div className="space-y-6">
                        {data.projects.map((proj, idx) => (
                          <div key={idx} className="relative pl-4 border-l-2 border-blue-500/30">
                            <h4 className="text-white font-bold text-base">{proj.title}</h4>
                            <span className="text-xs font-mono text-blue-400 mb-1 block">{proj.role}</span>
                            <p className="text-sm text-gray-400 mt-1">{proj.desc}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Education */}
                    <section className="resume-item">
                      <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 border-b border-white/10 pb-2">Education</h3>
                      <div className="space-y-6">
                        {data.education.map((edu, idx) => (
                          <div key={idx}>
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="text-white font-bold text-base">{edu.course}</h4>
                            </div>
                            <p className="text-blue-400 text-sm font-medium">{edu.school}</p>
                            <p className="text-gray-500 text-xs mt-1">{edu.details}</p>
                            <p className="text-gray-500 text-xs mt-1 font-mono">{edu.year}</p>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {/* RIGHT COLUMN (Sidebar) */}
                  <div className="md:col-span-4 space-y-10">
                    
                    {/* Contact Info */}
                    <section className="resume-item bg-white/5 p-6 rounded-lg border border-white/5">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Contact Details</h3>
                      <div className="space-y-3 text-sm text-gray-400">
                         <div className="flex items-start gap-3">
                            <IconMapPin className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" />
                            <span>{data.contact.address}</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <IconPhone className="w-4 h-4 shrink-0 text-blue-400" />
                            <span>{data.contact.mobile}</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <IconMail className="w-4 h-4 shrink-0 text-blue-400" />
                            <span>{data.contact.email}</span>
                         </div>
                      </div>
                    </section>

                    {/* Proficiency */}
                    <section className="resume-item">
                       <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 border-b border-white/10 pb-2">Proficiency</h3>
                       <div className="flex flex-wrap gap-2">
                          {data.skills.map((skill, i) => (
                             <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-gray-300">
                                {skill}
                             </span>
                          ))}
                       </div>
                    </section>

                    {/* Awards */}
                    <section className="resume-item">
                       <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 border-b border-white/10 pb-2">Awards</h3>
                       <ul className="list-disc list-outside ml-4 text-sm text-gray-300 space-y-1">
                          {data.awards.map((award, i) => (
                             <li key={i}>{award}</li>
                          ))}
                       </ul>
                    </section>

                    {/* Certifications */}
                    <section className="resume-item">
                       <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 border-b border-white/10 pb-2">Certifications</h3>
                       <ul className="space-y-3">
                          {data.certifications.map((cert, i) => (
                             <li key={i} className="text-sm text-gray-300 border-l-2 border-green-500/30 pl-3">
                                {cert}
                             </li>
                          ))}
                       </ul>
                    </section>

                    {/* Organizations */}
                    <section className="resume-item">
                       <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 border-b border-white/10 pb-2">Organizations</h3>
                       <ul className="text-sm text-gray-300 space-y-1">
                          {data.orgs.map((org, i) => (
                             <li key={i}>{org}</li>
                          ))}
                       </ul>
                    </section>

                     {/* Interests */}
                    <section className="resume-item">
                       <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 border-b border-white/10 pb-2">Interests</h3>
                       <div className="text-sm text-gray-400 leading-6">
                          {data.interests.join(" • ")}
                       </div>
                    </section>

                  </div>
                </div>
              </div>            
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ResumeModal;