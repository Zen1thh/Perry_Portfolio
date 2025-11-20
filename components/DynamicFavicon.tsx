
import React, { useEffect } from 'react';
import gsap from 'gsap';

const DynamicFavicon: React.FC = () => {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Find or create favicon link
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    // Animation State
    const state = {
      rotation: 0,
      pulse: 1,
      opacity: 0.8
    };

    // GSAP Animations
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    
    // Pulse effect
    tl.to(state, { 
      pulse: 1.3, 
      opacity: 1,
      duration: 1.5, 
      ease: "sine.inOut" 
    });
    
    // Constant rotation for the outer ring
    gsap.to(state, {
      rotation: 360,
      duration: 8,
      repeat: -1,
      ease: "none"
    });

    let frameCount = 0;

    const render = () => {
      // Optimization: Only update favicon every 3rd frame (approx 20fps) to save CPU
      // Updating the DOM/DataURL is expensive.
      frameCount++;
      if (frameCount % 3 !== 0) return;

      if (!ctx) return;

      // Clear Canvas
      ctx.clearRect(0, 0, 64, 64);
      
      // Draw Background (Optional: Rounded rect for dark mode support on light tabs)
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(0, 0, 64, 64, 16);
      ctx.fill();

      const cx = 32;
      const cy = 32;

      // --- Draw Rotating Outer Ring ---
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((state.rotation * Math.PI) / 180);
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.stroke();

      // Accent arc
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI / 2);
      ctx.stroke();
      ctx.restore();

      // --- Draw Pulsing Diamond Core ---
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI / 4); // Diamond orientation
      ctx.scale(state.pulse, state.pulse);
      
      ctx.fillStyle = '#ffffff';
      // Add glow
      ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowBlur = 10;
      
      ctx.beginPath();
      ctx.rect(-8, -8, 16, 16);
      ctx.fill();
      ctx.restore();

      // Update Favicon
      link.href = canvas.toDataURL('image/png');
    };

    // Add to GSAP ticker
    gsap.ticker.add(render);

    return () => {
      gsap.ticker.remove(render);
      tl.kill();
    };
  }, []);

  return null;
};

export default DynamicFavicon;
