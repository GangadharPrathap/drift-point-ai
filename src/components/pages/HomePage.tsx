import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Zap, Gauge, Trophy, Activity, Cpu, Timer, ArrowRight, Crosshair } from 'lucide-react';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- Utility Components ---

type AnimatedElementProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

const AnimatedReveal: React.FC<AnimatedElementProps> = ({ children, className, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          element.classList.add('is-visible');
        }, delay);
        observer.unobserve(element);
      }
    }, { threshold: 0.1 });

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`reveal-trigger ${className || ''}`}>
      {children}
    </div>
  );
};

const ParallaxImage = ({ src, alt, className, id }: { src: string, alt: string, className?: string, id?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="w-full h-[120%] -mt-[10%]">
        <Image
          src={src}
          alt={alt}
          width={1200}
          className="w-full h-full object-cover"
        />
      </motion.div>
    </div>
  );
};

const NeonButton = ({ to, children, variant = 'primary', className }: { to: string, children: React.ReactNode, variant?: 'primary' | 'secondary', className?: string }) => {
  return (
    <Link
      to={to}
      className={`group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-heading font-bold tracking-wider uppercase transition-all duration-300 border-2 ${
        variant === 'primary' 
          ? 'border-neon-blue text-background bg-neon-blue hover:bg-transparent hover:text-neon-blue' 
          : 'border-neon-orange text-neon-orange hover:bg-neon-orange hover:text-background'
      } ${className}`}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <div className={`absolute inset-0 transition-transform duration-300 origin-left transform scale-x-0 group-hover:scale-x-100 ${
        variant === 'primary' ? 'bg-background' : 'bg-neon-orange'
      }`} />
    </Link>
  );
};

// --- Main Component ---

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [0, 1]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Mouse position for spotlight effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const galleryItems = [
    { id: 'gallery-1', title: 'Precision Engineering', desc: 'Aerodynamic optimization' },
    { id: 'gallery-2', title: 'Track Dominance', desc: 'Real-time telemetry' },
    { id: 'gallery-3', title: 'Speed Unleashed', desc: 'Powertrain analytics' },
    { id: 'gallery-4', title: 'AI Analytics', desc: 'Predictive maintenance' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground font-paragraph selection:bg-neon-blue selection:text-background overflow-clip">
      
      <Header />
      
      {/* Global Styles for Custom Animations */}
      <style>{`
        .reveal-trigger {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-trigger.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .text-stroke {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
          color: transparent;
        }
        .text-stroke-blue {
          -webkit-text-stroke: 1px #00FFFF;
          color: transparent;
        }
        .grid-bg {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
        .clip-diagonal {
          clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
        }
        .clip-chevron {
          clip-path: polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%);
        }
      `}</style>

      {/* Fixed Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      {/* HERO SECTION */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center pt-20">
        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <Image
            src="https://static.wixstatic.com/media/6583f0_aa0cd88736c44cbd858db72c5d4f22d5~mv2.png?originWidth=1920&originHeight=1024"
            alt="High-speed go-kart racing on a neon-lit track"
            className="w-full h-full object-cover opacity-60"
            width={1920}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />
        </motion.div>

        <div className="relative z-10 max-w-[120rem] mx-auto px-4 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <AnimatedReveal>
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-neon-blue/30 rounded-full bg-neon-blue/10 mb-6">
                  <span className="w-2 h-2 bg-neon-blue rounded-full animate-ping" />
                  <span className="text-neon-blue text-xs font-mono tracking-widest uppercase">System Ready</span>
                </div>
              </AnimatedReveal>
              
              <AnimatedReveal delay={100}>
                <h1 className="text-7xl md:text-9xl font-heading font-black tracking-tighter leading-[0.85] mb-6 text-white">
                  DRIFT<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-white">POINT</span>
                  <span className="text-neon-orange text-6xl md:text-8xl align-top ml-2">.AI</span>
                </h1>
              </AnimatedReveal>

              <AnimatedReveal delay={200}>
                <p className="text-xl md:text-2xl text-gray-400 max-w-2xl font-light leading-relaxed mb-10 border-l-2 border-neon-orange pl-6">
                  Next-Gen Go-Kart Performance Analysis. <br />
                  <span className="text-white font-medium">Powered by AI. Built for Speed.</span>
                </p>
              </AnimatedReveal>

              <AnimatedReveal delay={300}>
                <div className="flex flex-col sm:flex-row gap-6">
                  <NeonButton to="/register-kart" variant="primary">
                    Initialize Registration <ChevronRight className="w-5 h-5" />
                  </NeonButton>
                  <NeonButton to="/dashboard" variant="secondary">
                    Enter Pit Crew <Zap className="w-5 h-5" />
                  </NeonButton>
                </div>
              </AnimatedReveal>
            </div>

            <div className="lg:col-span-4 hidden lg:block">
              <AnimatedReveal delay={400}>
                <div className="bg-glass-white backdrop-blur-xl border border-white/10 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
                    <span className="font-mono text-xs text-gray-400">LIVE TELEMETRY</span>
                    <Activity className="w-4 h-4 text-neon-blue" />
                  </div>
                  <div className="space-y-4 font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">ENGINE_TEMP</span>
                      <span className="text-neon-orange">184°F</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">TIRE_PRESS_FL</span>
                      <span className="text-white">12.4 PSI</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">AI_CONFIDENCE</span>
                      <span className="text-neon-blue">98.4%</span>
                    </div>
                    <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden mt-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "98%" }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-neon-blue"
                      />
                    </div>
                  </div>
                </div>
              </AnimatedReveal>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE SECTION */}
      <div className="relative py-8 bg-neon-blue/5 border-y border-neon-blue/20 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-4xl font-heading font-bold text-stroke-blue mx-8 opacity-50">
              PRECISION // SPEED // ANALYTICS // DOMINANCE //
            </span>
          ))}
        </div>
      </div>

      {/* FEATURES GRID - ASYMMETRICAL */}
      <section className="py-32 px-4 relative">
        <div className="max-w-[120rem] mx-auto">
          <AnimatedReveal className="mb-20">
            <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/10 pb-8">
              <div>
                <h2 className="text-5xl md:text-7xl font-heading font-bold text-white mb-4">
                  SYSTEM <span className="text-neon-blue">CORE</span>
                </h2>
                <p className="text-gray-400 max-w-md">Advanced telemetry processing units designed for competitive karting environments.</p>
              </div>
              <div className="hidden md:block text-right">
                <span className="font-mono text-neon-orange text-xl">v2.4.0 STABLE</span>
              </div>
            </div>
          </AnimatedReveal>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(300px,auto)]">
            {/* Feature 1: AI Analysis (Large) */}
            <div className="md:col-span-8 relative group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:border-neon-blue/50 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="p-10 h-full flex flex-col justify-between relative z-10">
                <div className="flex justify-between items-start">
                  <div className="p-4 bg-neon-blue/10 rounded-xl border border-neon-blue/20">
                    <Cpu className="w-8 h-8 text-neon-blue" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-500 group-hover:text-neon-blue group-hover:translate-x-2 transition-all" />
                </div>
                <div>
                  <h3 className="text-3xl font-heading font-bold mb-4">AI-Powered Analysis</h3>
                  <p className="text-gray-400 text-lg max-w-2xl">
                    Our advanced AI Pit Crew analyzes your kart's specifications in real-time, providing professional-grade tuning recommendations to maximize performance on the track.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2: Real Time (Tall) */}
            <div className="md:col-span-4 row-span-2 relative group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:border-neon-orange/50 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-b from-neon-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="p-10 h-full flex flex-col relative z-10">
                <div className="mb-auto">
                  <div className="p-4 bg-neon-orange/10 rounded-xl border border-neon-orange/20 w-fit mb-8">
                    <Zap className="w-8 h-8 text-neon-orange" />
                  </div>
                  <h3 className="text-3xl font-heading font-bold mb-4">Real-Time Insights</h3>
                  <p className="text-gray-400">
                    Get instant feedback on engine tuning, tire pressure, and weight distribution.
                  </p>
                </div>
                <div className="mt-12 pt-12 border-t border-white/10">
                  <div className="flex justify-between items-center font-mono text-sm text-gray-500 mb-2">
                    <span>PROCESSING</span>
                    <span className="text-neon-orange animate-pulse">ACTIVE</span>
                  </div>
                  <div className="space-y-2">
                    {[85, 92, 78, 95].map((val, i) => (
                      <div key={i} className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${val}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full bg-neon-orange"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Pro Performance */}
            <div className="md:col-span-4 relative group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:border-neon-blue/50 transition-colors duration-500">
              <div className="p-10 h-full flex flex-col justify-between relative z-10">
                <Trophy className="w-8 h-8 text-neon-blue mb-6" />
                <div>
                  <h3 className="text-2xl font-heading font-bold mb-2">Pro Performance</h3>
                  <p className="text-gray-400 text-sm">Track your improvements and compete with the best. Every millisecond counts.</p>
                </div>
              </div>
            </div>

            {/* Feature 4: Smart Tuning */}
            <div className="md:col-span-4 relative group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:border-white/30 transition-colors duration-500">
              <div className="p-10 h-full flex flex-col justify-between relative z-10">
                <Gauge className="w-8 h-8 text-white mb-6" />
                <div>
                  <h3 className="text-2xl font-heading font-bold mb-2">Smart Tuning</h3>
                  <p className="text-gray-400 text-sm">Leverage Google Gemini AI to receive personalized tuning advice.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STICKY SCROLL SECTION - "THE MECHANICS" */}
      <section className="relative py-24 bg-black">
        <div className="max-w-[120rem] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Sticky Left Side */}
            <div className="hidden lg:block relative h-[200vh]">
              <div className="sticky top-32 w-full aspect-square rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src="https://static.wixstatic.com/media/6583f0_b5496fff7c0a40538625a8a13de25859~mv2.png?originWidth=768&originHeight=768"
                  alt="Detailed kart mechanics"
                  className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
                  width={800}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-4 mb-4">
                    <Crosshair className="w-6 h-6 text-neon-orange" />
                    <span className="font-mono text-neon-orange">TARGET ACQUIRED</span>
                  </div>
                  <h3 className="text-4xl font-heading font-bold text-white">Precision Engineering</h3>
                </div>
                
                {/* Decorative HUD Elements */}
                <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-neon-blue/30 rounded-tr-xl" />
                <div className="absolute bottom-8 left-8 w-24 h-24 border-l-2 border-b-2 border-neon-blue/30 rounded-bl-xl" />
              </div>
            </div>

            {/* Scrolling Right Side */}
            <div className="py-24 space-y-48">
              <AnimatedReveal>
                <div className="space-y-6">
                  <span className="text-neon-blue font-mono text-sm tracking-widest">01 // DATA INGESTION</span>
                  <h3 className="text-4xl md:text-5xl font-heading font-bold">Sensors & Telemetry</h3>
                  <p className="text-xl text-gray-400 leading-relaxed">
                    We connect directly to your kart's onboard computer or external sensor array. From tire temperature to RPM curves, every data point is captured with millisecond precision.
                  </p>
                  <ul className="space-y-3 text-gray-500 font-mono">
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-neon-blue" /> RPM & Speed Analysis</li>
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-neon-blue" /> G-Force Mapping</li>
                    <li className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-neon-blue" /> Tire Thermal Dynamics</li>
                  </ul>
                </div>
              </AnimatedReveal>

              <AnimatedReveal>
                <div className="space-y-6">
                  <span className="text-neon-orange font-mono text-sm tracking-widest">02 // AI PROCESSING</span>
                  <h3 className="text-4xl md:text-5xl font-heading font-bold">Gemini Core Integration</h3>
                  <p className="text-xl text-gray-400 leading-relaxed">
                    Raw data is fed into our custom-tuned Google Gemini model. It compares your performance against thousands of pro laps and physics simulations to find the perfect setup.
                  </p>
                  <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                    <div className="font-mono text-xs text-gray-500 mb-2">AI_OUTPUT_LOG</div>
                    <div className="font-mono text-sm text-neon-orange">
                      {`> Analyzing corner entry speed...`}<br/>
                      {`> Detected understeer in Sector 2.`}<br/>
                      {`> Recommendation: Stiffen front anti-roll bar +2 clicks.`}
                    </div>
                  </div>
                </div>
              </AnimatedReveal>

              <AnimatedReveal>
                <div className="space-y-6">
                  <span className="text-white font-mono text-sm tracking-widest">03 // EXECUTION</span>
                  <h3 className="text-4xl md:text-5xl font-heading font-bold">Track Implementation</h3>
                  <p className="text-xl text-gray-400 leading-relaxed">
                    Apply the changes and see the results instantly. Our dashboard tracks the delta in real-time, proving that data-driven decisions lead to podium finishes.
                  </p>
                  <NeonButton to="/dashboard" className="mt-8">
                    View Live Demo
                  </NeonButton>
                </div>
              </AnimatedReveal>
            </div>
          </div>
        </div>
      </section>

      {/* FULL BLEED PARALLAX BREAKER */}
      <section className="relative h-[80vh] overflow-hidden flex items-center justify-center">
        <ParallaxImage 
          src="https://static.wixstatic.com/media/6583f0_3a4f619d30724e52ae348185d91b1481~mv2.png?originWidth=576&originHeight=320"
          alt="Kart racing at high speed"
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-neon-blue/20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 text-center">
          <AnimatedReveal>
            <h2 className="text-8xl md:text-[12rem] font-heading font-black text-transparent text-stroke opacity-50 tracking-tighter">
              VELOCITY
            </h2>
          </AnimatedReveal>
        </div>
      </section>

      {/* HORIZONTAL SCROLL GALLERY */}
      <section className="py-32 bg-background overflow-hidden">
        <div className="max-w-[120rem] mx-auto px-4 mb-16 flex justify-between items-end">
          <AnimatedReveal>
            <h2 className="text-5xl font-heading font-bold">THE <span className="text-neon-blue">GARAGE</span></h2>
          </AnimatedReveal>
          <div className="hidden md:flex gap-2">
            <button className="p-4 border border-white/10 rounded-full hover:bg-white/10 transition-colors"><ArrowRight className="w-6 h-6 rotate-180" /></button>
            <button className="p-4 border border-white/10 rounded-full hover:bg-white/10 transition-colors"><ArrowRight className="w-6 h-6" /></button>
          </div>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-12 px-4 md:px-[max(1rem,calc((100vw-120rem)/2))] scrollbar-hide snap-x snap-mandatory">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex-shrink-0 w-[85vw] md:w-[600px] snap-center group relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-900"
            >
              <Image
                src={'https://static.wixstatic.com/media/6583f0_f0d1e6ac96e6417f8d4c2382e4767780~mv2.png?originWidth=576&originHeight=320'}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                width={600}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              
              <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex justify-between items-end border-b border-white/20 pb-4 mb-4">
                  <span className="font-mono text-neon-blue text-xs">IMG_0{index + 1}</span>
                  <ArrowRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity delay-100" />
                </div>
                <h3 className="text-3xl font-heading font-bold text-white mb-1">{item.title}</h3>
                <p className="text-gray-400 font-mono text-sm">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-neon-orange/5 clip-diagonal" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <AnimatedReveal>
            <div className="inline-block mb-6 p-3 rounded-full bg-neon-orange/10 border border-neon-orange/20">
              <Timer className="w-6 h-6 text-neon-orange" />
            </div>
            <h2 className="text-6xl md:text-8xl font-heading font-black mb-8 leading-tight">
              READY TO <br/>
              <span className="text-neon-orange">DOMINATE?</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
              Join the future of go-kart racing. Register your kart today and unlock the full potential of AI-powered performance insights.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <NeonButton to="/register-kart" variant="secondary" className="w-full sm:w-auto">
                Start Your Engine
              </NeonButton>
            </div>
          </AnimatedReveal>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}