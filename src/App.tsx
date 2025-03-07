import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Background } from './components/Background';
import { AgentProfile } from './components/AgentProfile';
import { Dashboard } from './components/portal/Dashboard';
import { ArrowRight, BarChart2, Brain, Wallet, LineChart } from 'lucide-react';
import { Footer } from './components/Footer';
import { ScrollAnimationDemo } from './components/ScrollAnimationDemo';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <Background />
      
      <div className="relative z-10">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-green-500/20 py-4 px-6">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold text-green-400">Blockswarm</div>
            <button 
              onClick={() => navigate('/portal')}
              className="px-6 py-2 bg-green-500 text-black font-semibold rounded-lg hover:bg-green-400 transition-colors"
            >
              Enter Portal
            </button>
          </div>
        </nav>

        {/* Hero Section with Scroll Animation */}
        <ScrollAnimationDemo />

        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {[
              {
                icon: <Brain className="w-8 h-8 text-green-400" />,
                title: 'AI Analysis',
                description: 'Advanced token analysis powered by Claude AI',
              },
              {
                icon: <BarChart2 className="w-8 h-8 text-green-400" />,
                title: 'Live Signals',
                description: 'Real-time trading signals and market insights',
              },
              {
                icon: <Wallet className="w-8 h-8 text-green-400" />,
                title: 'Portfolio Tracking',
                description: 'Monitor and manage your Solana portfolio',
              },
              {
                icon: <LineChart className="w-8 h-8 text-green-400" />,
                title: 'Market Data',
                description: 'Comprehensive price and market cap tracking',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-black/80 backdrop-blur-lg rounded-xl p-6 border border-green-500/20 hover:border-green-500/40 transition-all duration-300"
              >
                {feature.icon}
                <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Testimonials Section */}
          <div className="mb-24">
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              What Our Investors Say
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  quote: "TradesXBT has transformed my Solana trading strategy. The AI insights are consistently ahead of market trends.",
                  author: "Alex K.",
                  role: "Early Investor"
                },
                {
                  quote: "I've tried many trading platforms, but none offer the level of AI intelligence and Solana ecosystem focus like TradesXBT.",
                  author: "Sarah M.",
                  role: "Crypto Entrepreneur"
                },
                {
                  quote: "The returns I've seen since joining the hedge fund have exceeded my expectations. The AI agent is truly impressive.",
                  author: "David L.",
                  role: "Institutional Investor"
                }
              ].map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-black/80 backdrop-blur-lg rounded-xl p-6 border border-green-500/20"
                >
                  <div className="mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-green-400">★</span>
                    ))}
                  </div>
                  <p className="text-gray-400 mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-white">{testimonial.author}</p>
                    <p className="text-green-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

const DashboardLayout: React.FC = () => {
  return (
    <div>
      <Dashboard />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/portal" element={<DashboardLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;