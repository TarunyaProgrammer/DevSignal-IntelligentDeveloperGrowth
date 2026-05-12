import React, { useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Cpu, Terminal } from 'lucide-react';
import { SEO } from '../components/layout/SEO';
import { WordsPullUp } from '../components/landing/WordsPullUp';
import { WordsPullUpMultiStyle } from '../components/landing/WordsPullUpMultiStyle';
import { AnimatedLetter } from '../components/landing/AnimatedLetter';
import { cn } from '@/lib/utils';
import { LandingFooter } from '../components/landing/LandingFooter';

const SMOOTH_EASE = [0.16, 1, 0.3, 1] as const;

export function LandingPage() {
  const { signInWithGitHub, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="dark bg-black min-h-screen">
      <style dangerouslySetInnerHTML={{
        __html: `
        body { background-color: black !important; }
        html { background-color: black !important; }
      `}} />
      <div className="relative min-h-screen bg-bg text-text overflow-x-hidden selection:bg-primary/30">
        <SEO
          description="DevSignal: The high-fidelity intelligence layer for modern engineering teams. Decipher repository velocity and scale technical standards with mathematical precision."
        />

        {/* SECTION 1: HERO */}
        <section className="relative w-full h-screen p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: SMOOTH_EASE }}
            className="relative w-full h-full rounded-2xl md:rounded-[3rem] overflow-hidden shadow-2xl"
          >
            {/* Background Video */}
            <video
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
              autoPlay
              loop
              muted
              playsInline
              crossOrigin="anonymous"
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.2]"
            />
            {/* Overlays */}
            <div className="absolute inset-0 noise-overlay opacity-[0.6] mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

            {/* Navbar */}
            <nav className="absolute top-0 left-1/2 -translate-x-1/2 z-50 pt-8">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8, duration: 1, ease: SMOOTH_EASE }}
                className="bg-black/80 backdrop-blur-xl border border-white/5 rounded-full px-6 py-3 md:px-10 flex items-center justify-center gap-6 md:gap-14 shadow-2xl"
              >
                {[
                  { label: 'Intelligence', href: '#platform' },
                  { label: 'Signals', href: '#analytics' },
                  { label: 'Enterprise', href: '#' },
                  { label: 'Documentation', href: '#' }
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-[10px] md:text-xs uppercase tracking-widest transition-all duration-500 hover:text-primary hover:tracking-[0.2em] opacity-80 hover:opacity-100"
                  >
                    {item.label}
                  </a>
                ))}
              </motion.div>
            </nav>

            {/* Hero Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-16 lg:p-20 pointer-events-none">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end pointer-events-auto">
                <div className="lg:col-span-8">
                  <WordsPullUp
                    text="DEVSIGNAL"
                    showAsterisk={true}
                    className="text-[20vw] sm:text-[18vw] md:text-[16vw] lg:text-[14vw] xl:text-[12vw] font-bold leading-[0.75] tracking-[-0.08em] mix-blend-difference"
                  />
                </div>
                <div className="lg:col-span-4 flex flex-col items-start lg:items-end lg:text-right space-y-6 md:space-y-8 lg:pb-6">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 1, ease: SMOOTH_EASE }}
                    className="space-y-3 md:space-y-4"
                  >
                    <p className="text-primary/90 text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold">Mathematical Precision</p>
                    <p className="text-primary/60 text-sm md:text-lg leading-relaxed max-w-sm font-medium">
                      The ultimate intelligence layer. Decipher repository velocity and scale technical standards with absolute clarity.
                    </p>
                  </motion.div>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.8, delay: 1.2, ease: SMOOTH_EASE }}
                    onClick={signInWithGitHub}
                    className="group bg-primary rounded-full pl-6 md:pl-8 pr-1.5 md:pr-2 py-1.5 md:py-2 flex items-center text-black font-bold text-[10px] md:text-sm tracking-widest uppercase transition-all shadow-2xl hover:shadow-primary/20"
                  >
                    Initiate Sync
                    <div className="bg-black rounded-full w-8 h-8 md:w-10 md:h-10 ml-4 md:ml-6 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                      <ArrowRight size={18} className="text-primary" />
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* SECTION 2: PLATFORM / ABOUT */}
        <section id="platform" className="bg-bg py-32 md:py-48 px-6 md:px-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />

          <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center space-y-12 md:space-y-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: SMOOTH_EASE }}
              className="flex flex-col items-center"
            >
              <span className="text-primary text-[10px] md:text-xs tracking-[0.6em] uppercase font-bold mb-12 md:mb-16">Core Architecture</span>

              <WordsPullUpMultiStyle
                className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl max-w-6xl mx-auto leading-[0.9] tracking-tighter text-text font-bold"
                segments={[
                  { text: "Beyond tracking. " },
                  { text: "Deep intelligence", className: "font-serif italic text-primary px-2" },
                  { text: " for visionary engineers." }
                ]}
              />
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <AnimatedLetter
                className="text-primary/60 text-sm md:text-2xl leading-relaxed font-medium tracking-tight"
                text="DevSignal is not a dashboard. It is a high-fidelity intelligence layer that parses raw repository activity into actionable growth vectors. We help the world's most ambitious developers master complexity and deliver excellence at scale."
              />
            </div>
          </div>
        </section>

        {/* SECTION 3: SIGNALS / FEATURES */}
        <section id="analytics" className="relative bg-bg py-32 md:py-48 px-6 md:px-12">
          <div className="absolute inset-0 bg-noise opacity-[0.1] pointer-events-none" />

          <div className="relative z-10 max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start mb-32">
              <div className="space-y-8">
                <motion.h2
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: SMOOTH_EASE }}
                  className="text-4xl md:text-6xl font-bold tracking-tighter"
                >
                  High-Fidelity <br />
                  <span className="text-primary font-serif italic">Analytics.</span>
                </motion.h2>
                <p className="text-primary/60 text-lg max-w-md font-medium leading-relaxed">
                  Experience studio-grade insights. Every commit, every line of logic, transformed into a signal of progress.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                {[
                  { icon: Zap, label: 'Velocity Scoring', desc: 'Measure development speed with precision algorithms.' },
                  { icon: Shield, label: 'Signal Integrity', desc: 'Secure, encrypted data parsing across your stack.' },
                  { icon: Cpu, label: 'Pattern Detection', desc: 'Auto-detect architectural patterns and anti-patterns.' },
                  { icon: Terminal, label: 'Neural Insights', desc: 'AI-driven suggestions for technical evolution.' }
                ].map((feat, i) => (
                  <motion.div
                    key={feat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.8, ease: SMOOTH_EASE }}
                    className="space-y-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <feat.icon size={24} />
                    </div>
                    <h4 className="text-lg font-bold text-white">{feat.label}</h4>
                    <p className="text-primary/50 text-sm leading-relaxed">{feat.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FeatureCard delay={0}>
                <div className="absolute inset-0">
                  <video
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4"
                    autoPlay loop muted playsInline crossOrigin="anonymous" className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="relative z-10 h-full flex items-end p-8">
                  <h3 className="text-white text-xl font-bold leading-tight">Master the <br /> Mathematical Canvas.</h3>
                </div>
              </FeatureCard>

              <FeatureListCard
                delay={0.1}
                number="01"
                title="Intelligence Matrix."
                iconUrl="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85"
                items={["Real-time Velocity tracking", "Neural Signal Pulse", "Global Contribution mapping", "Architecture Scoring"]}
              />

              <FeatureListCard
                delay={0.2}
                number="02"
                title="Codex Archive."
                iconUrl="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85"
                items={["Elite Learning Paths", "Sophisticated Patterns", "Biometric Skill Verification"]}
              />

              <FeatureListCard
                delay={0.3}
                number="03"
                title="Logic Studio."
                iconUrl="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85"
                items={["Distraction-Free Logic", "Live Architecture Sync", "Mathematical Precision Editor"]}
              />
            </div>
          </div>
        </section>

        <LandingFooter />
      </div>
    </div>
  );
}

function FeatureCard({ children, delay, className }: { children: React.ReactNode, delay: number, className?: string }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 1, delay, ease: SMOOTH_EASE }}
      className={cn("bg-[#111111] border border-white/5 rounded-[2rem] overflow-hidden lg:h-[520px] relative group", className)}
    >
      {children}
    </motion.div>
  );
}

function FeatureListCard({ number, title, items, iconUrl, delay }: { number: string, title: string, items: string[], iconUrl: string, delay: number }) {
  return (
    <FeatureCard delay={delay} className="p-10 flex flex-col hover:border-primary/30 transition-colors duration-700">
      <div className="mb-14">
        <div className="relative w-14 h-14 mb-8">
          <img src={iconUrl} alt="icon" className="w-full h-full rounded-2xl object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
          <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </div>
        <h3 className="text-2xl text-white font-bold tracking-tight flex items-baseline gap-4">
          {title} <span className="text-primary text-xs font-serif italic tracking-widest">{number}</span>
        </h3>
      </div>

      <div className="space-y-5 mb-12 flex-1">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-1 h-1 rounded-full bg-primary/40" />
            <span className="text-primary/60 text-sm font-medium tracking-wide group-hover:text-primary/80 transition-colors">{item}</span>
          </div>
        ))}
      </div>

      <a href="#" className="inline-flex items-center gap-3 text-primary text-xs font-bold uppercase tracking-[0.2em] group/btn">
        Explore Module
        <ArrowRight size={14} className="group-hover/btn:translate-x-2 transition-transform duration-500" />
      </a>
    </FeatureCard>
  );
}
