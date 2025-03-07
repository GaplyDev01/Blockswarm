import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function ScrollAnimationDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  
  // Dashboard images with consistent paths
  const dashboardImages = [
    { src: "/assets/db1.png", alt: "AI Chat" },
    { src: "/assets/db2.png", alt: "TradesXBT Dashboard" },
    { src: "/assets/db3.png", alt: "Customizable Charts" },
    { src: "/assets/db4.png", alt: "Portfolio Analysis" }
  ];

  // Animations based on scroll
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);
  
  // Features animations
  const featuresOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1]);
  const featuresY = useTransform(scrollYProgress, [0.3, 0.5], [50, 0]);
  
  // Dashboard 3D animations
  const dashboardOpacity = useTransform(scrollYProgress, [0.1, 0.2, 0.6, 0.8], [0, 1, 1, 0]);
  const dashboardRotateX = useTransform(scrollYProgress, [0.1, 0.5], [20, 0]);
  const dashboardY = useTransform(scrollYProgress, [0.1, 0.5], [100, -50]);
  const dashboardScale = useTransform(scrollYProgress, [0.1, 0.5], [0.8, 1]);

  // Handle image error
  const handleImageError = (index: number) => {
    console.error(`Failed to load image at index ${index}:`, dashboardImages[index].src);
    setImageError(prev => ({...prev, [index]: true}));
  };

  // Auto-rotate carousel
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (autoPlay) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === dashboardImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoPlay, dashboardImages.length]);

  // Handle manual navigation
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? dashboardImages.length - 1 : prevIndex - 1
    );
    setAutoPlay(false);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === dashboardImages.length - 1 ? 0 : prevIndex + 1
    );
    setAutoPlay(false);
  };

  return (
    <div ref={containerRef} className="relative min-h-[130vh] w-full overflow-hidden">
      {/* Hero section with parallax effect */}
      <motion.div 
        className="sticky top-0 flex flex-col items-center justify-center min-h-screen w-full py-20 px-4"
        style={{ opacity, scale, y }}
      >
        <motion.div className="text-center max-w-4xl mx-auto">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              AI-Powered Trading
            </span>
            <br />for the Solana Ecosystem
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Experience the future of crypto trading with TradesXBT, your autonomous AI hedge fund agent
            specializing in the Solana ecosystem.
          </motion.p>
        </motion.div>
      </motion.div>
      
      {/* 3D Dashboard Carousel */}
      <motion.div
        className="sticky top-[30%] w-full mb-24"
        style={{ 
          opacity: dashboardOpacity,
          translateY: dashboardY,
          scale: dashboardScale
        }}
      >
        <div className="max-w-5xl mx-auto px-4 relative">
          {/* Carousel navigation */}
          <div className="absolute top-1/2 left-4 -translate-y-1/2 z-10">
            <button 
              onClick={goToPrevious}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
              aria-label="Previous slide"
              onMouseEnter={() => setAutoPlay(false)}
            >
              <ChevronLeft size={20} />
            </button>
          </div>
          
          <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10">
            <button 
              onClick={goToNext}
              className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white border border-white/10 flex items-center justify-center hover:bg-black/60 transition-colors"
              aria-label="Next slide"
              onMouseEnter={() => setAutoPlay(false)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          {/* Carousel container with 3D effect */}
          <motion.div 
            className="w-full rounded-xl shadow-2xl overflow-hidden relative"
            style={{
              perspective: "1000px",
              rotateX: dashboardRotateX,
              boxShadow: "0 25px 50px -12px rgba(22, 153, 118, 0.25)",
              border: "1px solid rgba(22, 153, 118, 0.3)"
            }}
          >
            {/* Carousel slides */}
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-black/20">
              <AnimatePresence initial={false}>
                <motion.img 
                  key={currentIndex}
                  src={dashboardImages[currentIndex].src}
                  alt={dashboardImages[currentIndex].alt}
                  className="w-full h-full object-cover absolute inset-0"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 }
                  }}
                  onError={() => handleImageError(currentIndex)}
                />
              </AnimatePresence>
              
              {/* Fallback content if image fails to load */}
              {imageError[currentIndex] && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-gray-900 to-black text-white p-4">
                  <div className="text-3xl mb-2">🖼️</div>
                  <p className="font-medium text-lg mb-1">{dashboardImages[currentIndex].alt}</p>
                  <p className="text-sm text-gray-400">Image could not be loaded</p>
                </div>
              )}
            </div>
            
            {/* Carousel indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {dashboardImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setAutoPlay(false);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    currentIndex === index 
                      ? 'bg-viridian' 
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Slide caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm text-white p-4 text-center">
              <p className="text-sm font-medium bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent inline-block">
                {dashboardImages[currentIndex].alt}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features section that appears on scroll */}
      <motion.div 
        className="sticky top-20 w-full py-20 px-4"
        style={{ opacity: featuresOpacity, y: featuresY }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Powerful AI Trading Features
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Our advanced AI technology helps you navigate the Solana ecosystem with confidence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Real-time Analysis",
                description: "Continuously monitors market conditions, on-chain data, and social sentiment",
                icon: "📊"
              },
              {
                title: "Trading Signals",
                description: "Receives AI-generated signals with precise entry and exit points",
                icon: "🚀"
              },
              {
                title: "Portfolio Management",
                description: "Track and manage your investments with detailed performance analytics",
                icon: "💼"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-black/80 backdrop-blur-lg rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}