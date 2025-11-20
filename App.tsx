import React from 'react';
import ParticleBackground from './components/ParticleBackground';
import Hero from './components/Hero';
import About from './components/About';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import Contact from './components/Contact';
import AIChat from './components/AIChat';
import Navbar from './components/Navbar';
import SmoothScroll from './components/SmoothScroll';
import CustomCursor from './components/CustomCursor';

function App() {
  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-white selection:text-black font-inter">
      <CustomCursor />
      <ParticleBackground />
      
      <SmoothScroll>
        <Navbar />
        <main>
          <Hero />
          <About />
          <TechStack />
          <Projects />
          <Contact />
        </main>
      </SmoothScroll>

      {/* Fixed elements must be outside SmoothScroll to avoid transform stacking contexts */}
      <AIChat />
    </div>
  );
}

export default App;